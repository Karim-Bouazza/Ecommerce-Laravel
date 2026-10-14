<?php

namespace App\Http\Controllers\Api\Fraud;

use App\Enums\Fraud\FraudReviewLabel;
use App\Http\Controllers\Controller;
use App\Http\Requests\Fraud\FraudReviewRequest;
use App\Http\Resources\Fraud\FraudAssessmentResource;
use App\Models\Fraud\FraudAssessment;
use App\Models\Order\Order;
use App\Services\Fraud\FraudIdentifiers;
use App\Services\Fraud\FraudReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FraudController extends Controller
{
    private const WITH = ['order.client', 'order.fraudReview.reviewer', 'attempt'];

    public function __construct(private readonly FraudReviewService $reviews) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless($request->user()->hasPermission('fraud.view'), 403);

        $search = trim((string) $request->input('search', ''));
        $level = $request->input('risk_level');
        $label = $request->input('review_label');

        $assessments = FraudAssessment::query()
            ->with(self::WITH)
            ->when($level, fn ($q) => $q->where('risk_level', $level))
            ->when($label === FraudReviewLabel::Unknown->value, fn ($q) => $q->whereDoesntHave(
                'order.fraudReview', fn ($r) => $r->where('label', '!=', FraudReviewLabel::Unknown->value)
            ))
            ->when($label && $label !== FraudReviewLabel::Unknown->value, fn ($q) => $q->whereHas(
                'order.fraudReview', fn ($r) => $r->where('label', $label)
            ))
            ->when($search !== '', fn ($q) => $q->whereHas('order', fn ($o) => $o
                ->where('reference', 'like', "%{$search}%")
                ->orWhereHas('client', fn ($c) => $c->where('phone_number', 'like', "%{$search}%"))))
            ->orderByDesc('score')
            ->orderByDesc('id')
            ->paginate((int) $request->input('per_page', 15))
            ->withQueryString();

        return FraudAssessmentResource::collection($assessments);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_unless($request->user()->hasPermission('fraud.view'), 403);

        $assessment = FraudAssessment::query()
            ->with([...self::WITH, 'histories'])
            ->where('order_id', $order->id)
            ->firstOrFail();

        $base = (new FraudAssessmentResource($assessment))->toArray($request);

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

    public function review(FraudReviewRequest $request, Order $order): JsonResponse
    {
        abort_unless(FraudAssessment::where('order_id', $order->id)->exists(), 404);

        $review = $this->reviews->setLabel(
            $order,
            FraudReviewLabel::from($request->validated('label')),
            $request->validated('reason'),
            $request->user(),
        );

        return response()->json([
            'label' => $review->label->value,
            'reason' => $review->reason,
            'reviewed_by' => $review->reviewer?->name,
            'reviewed_at' => $review->reviewed_at?->toIso8601String(),
        ]);
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
                'status' => $order?->status?->value,
                'status_label' => $order?->status?->label(),
                'review_label' => $order?->fraudReview?->label?->value ?? 'UNKNOWN',
                'shared' => $shared,
                'created_at' => $other->created_at?->toIso8601String(),
            ];
        })->values()->all();
    }
}
