<?php

namespace App\Http\Controllers\Api\Fraud;

use App\Data\Fraud\FraudAssessmentData;
use App\Data\Fraud\FraudReviewData;
use App\Enums\Fraud\FraudReviewLabel;
use App\Http\Controllers\Controller;
use App\Models\Fraud\FraudAssessment;
use App\Models\Order\Order;
use App\Services\Fraud\FraudIdentifiers;
use App\Services\Fraud\FraudReviewService;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class FraudController extends Controller
{
    private const WITH = ['order.client', 'order.fraudReview.reviewer', 'attempt'];

    public function __construct(private readonly FraudReviewService $reviews) {}

    public function index(Request $request): PaginatedDataCollection
    {
        $assessments = QueryBuilder::for(
            FraudAssessment::query()->with(self::WITH),
            ListQuery::request($request, ['search', 'risk_level', 'review_label']),
        )
            ->allowedFilters(
                AllowedFilter::exact('risk_level'),
                AllowedFilter::callback('review_label', fn ($query, $label) => $label === FraudReviewLabel::Unknown->value
                    ? $query->whereDoesntHave('order.fraudReview', fn ($review) => $review->where('label', '!=', FraudReviewLabel::Unknown->value))
                    : $query->whereHas('order.fraudReview', fn ($review) => $review->where('label', $label))),
                AllowedFilter::callback('search', function ($query, $value) {
                    $search = trim(is_array($value) ? implode(',', $value) : (string) $value);

                    $query->whereHas('order', fn ($order) => $order
                        ->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('client', fn ($client) => $client->where('phone_number', 'like', "%{$search}%")));
                }),
            )
            ->allowedSorts('score', 'assessed_at', 'created_at')
            ->defaultSort('-score', '-id')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $sensitive = $this->canViewSensitive($request);

        $assessments->through(fn (FraudAssessment $assessment) => FraudAssessmentData::fromAssessment($assessment, $sensitive));

        return FraudAssessmentData::collect($assessments, PaginatedDataCollection::class);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        $assessment = FraudAssessment::query()
            ->with([...self::WITH, 'histories'])
            ->where('order_id', $order->id)
            ->firstOrFail();

        $base = FraudAssessmentData::fromAssessment($assessment, $this->canViewSensitive($request))->toArray();

        return response()->json([
            ...$base,
            'reasons' => $assessment->reasons,
            'historical' => $assessment->historical,
            'related_orders' => $this->relatedOrders($assessment),
            'history' => $assessment->histories()->orderBy('id')->get()->map(fn ($h) => [
                'old_score' => $h->old_score,
                'new_score' => $h->new_score,
                'old_risk_level' => $h->old_risk_level,
                'new_risk_level' => $h->new_risk_level,
                'trigger' => $h->trigger,
                'created_at' => $h->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function review(FraudReviewData $data, Order $order, Request $request): JsonResponse
    {
        abort_unless(FraudAssessment::where('order_id', $order->id)->exists(), 404);

        $review = $this->reviews->setLabel(
            $order,
            $data->label,
            $data->reason,
            $request->user(),
        );

        return response()->json([
            'label' => $review->label->value,
            'reason' => $review->reason,
            'reviewed_by' => $review->reviewer?->name,
            'reviewed_at' => $review->reviewed_at?->toIso8601String(),
        ]);
    }

    private function canViewSensitive(Request $request): bool
    {
        return (bool) $request->user()?->hasPermission('fraud.view_sensitive');
    }

    /** @return list<array<string, mixed>> */
    private function relatedOrders(FraudAssessment $assessment): array
    {
        $attempt = $assessment->attempt;
        if (! $attempt) {
            return [];
        }

        $keys = FraudIdentifiers::keysOf($attempt);
        if ($keys === []) {
            return [];
        }

        $attempts = FraudIdentifiers::sharingAnyKey(
            FraudIdentifiers::createdOrderAttempts()->where('order_id', '!=', $assessment->order_id),
            $keys
        )->latest('id')->limit(30)->get();

        $orders = Order::with('fraudReview')
            ->whereIn('id', $attempts->pluck('order_id')->unique())
            ->get()
            ->keyBy('id');

        return $attempts->unique('order_id')->take(20)->map(function ($other) use ($orders, $keys) {
            $order = $orders[$other->order_id] ?? null;
            $shared = collect($keys)
                ->filter(fn ($key, $type) => $other->{FraudIdentifiers::COLUMNS[$type]} === $key)
                ->keys()->values();

            return [
                'order_id' => $other->order_id,
                'reference' => $order?->reference,
                'status' => $order?->status?->getValue(),
                'status_label' => $order?->status?->label(),
                'review_label' => $order?->fraudReview?->label?->value ?? 'UNKNOWN',
                'shared' => $shared,
                'created_at' => $other->created_at?->toIso8601String(),
            ];
        })->values()->all();
    }
}
