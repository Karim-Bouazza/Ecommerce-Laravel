<?php

namespace App\Http\Controllers\Api\Order;

use App\Data\Order\OrderData;
use App\Data\Order\OrderStatusHistoryData;
use App\Data\Order\SaveManualOrderData;
use App\Data\Order\UpdateOrderStatusData;
use App\Enums\Order\OrderStatus;
use App\Enums\Order\OrderType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Jobs\SendOrderToTelegram;
use App\Models\Catalog\Product;
use App\Models\Order\Order;
use App\Models\Order\OrderStatusHistory;
use App\Services\Fraud\FraudDetectionService;
use App\Services\Orders\CreateOrderService;
use App\Services\Orders\OrderStatusService;
use App\Services\Orders\UpdateOrderService;
use App\Services\PixelTracking\ExcludedIpMatcher;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller
{
    protected const WITH = ['client.wilaya', 'client.commune', 'stopDeskCompany', 'items.warehouse', 'latestStatusHistory', 'fraudAssessment', 'fraudReview'];

    public function __construct(
        private readonly CreateOrderService $createOrderService,
        private readonly UpdateOrderService $updateOrderService,
        private readonly OrderStatusService $orderStatusService,
        private readonly FraudDetectionService $fraudDetection,
        private readonly ExcludedIpMatcher $excludedIps,
    ) {}

    public function store(CreateOrderRequest $request)
    {
        $data = $request->validated();
        unset($data['fingerprint']);

        $ip = $request->ip();
        $alreadyTracked = $ip !== null && Order::query()
            ->where('ip_address', $ip)
            ->where('created_at', '>=', now()->subDay())
            ->exists();

        $order =$this->createOrderService->execute(
            [
                ...$data,
                'ip_address' => $request->ip(),
            ]
        );

        // Observe-only: records the attempt and scores it; never throws or blocks.
        $this->fraudDetection->handleCreatedOrder($order, $request, $request->validated());

        SendOrderToTelegram::dispatchAfterResponse($order);

        return response()->json([
            'id' => $order->id,
            'reference' => $order->reference,
            'track_purchase' => ! $alreadyTracked && ! $this->excludedIps->matches($ip),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $statusGroup = trim((string) $request->input('status_group', ''));

        $groupPermission = match ($statusGroup) {
            'nouvelles' => 'orders_nouvelles.view',
            'en_cours' => 'orders_en_cours.view',
            'confirmees' => 'orders_confirmees.view',
            'terminees' => 'orders_terminees.view',
            'annulees' => 'orders_annulees.view',
            default => null,
        };

        abort_unless(
            $request->user()->can('orders.view')
                || ($groupPermission && $request->user()->can($groupPermission)),
            403
        );

        $groupStatuses = $statusGroup !== '' ? OrderStatus::forGroup($statusGroup) : [];

        $status = OrderStatus::tryFrom(trim((string) $request->input('status', '')));
        $filteredStatuses = $status !== null && in_array($status, $groupStatuses, true)
            ? [$status]
            : $groupStatuses;

        $latestActivitySort = fn ($query, bool $descending) => $query->orderBy(
            DB::raw('coalesce((' . OrderStatusHistory::select('created_at')
                ->whereColumn('order_id', 'orders.id')
                ->latest('created_at')
                ->limit(1)
                ->toSql() . '), created_at)'),
            $descending ? 'desc' : 'asc',
        );
        $latestActivity = AllowedSort::callback('latest_activity', $latestActivitySort);

        $orders = QueryBuilder::for(
            Order::query()
                ->with(self::WITH)
                ->when($statusGroup !== '', function ($query) use ($filteredStatuses) {
                    $query->whereIn('status', array_column($filteredStatuses, 'value'));
                }),
            ListQuery::request($request, ['search', 'status', 'status_group']),
        )
            ->allowedFilters(
                AllowedFilter::custom('search', new SearchFilter(['reference'], ['client' => ['first_name', 'last_name', 'phone_number']])),
                AllowedFilter::callback('status', fn () => null),
                AllowedFilter::callback('status_group', fn () => null),
            )
            ->allowedSorts($latestActivity, 'created_at', 'reference')
            ->defaultSort(AllowedSort::callback('-latest_activity', $latestActivitySort))
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $counts = $groupStatuses === []
            ? collect()
            : Order::query()
                ->whereIn('status', array_column($groupStatuses, 'value'))
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status');

        $canViewFraud = (bool) $request->user()?->hasPermission('fraud.view');

        $orders->through(fn (Order $order) => OrderData::fromOrder($order, $canViewFraud));

        return response()->json([
            ...OrderData::collect($orders, PaginatedDataCollection::class)->toArray(),
            'filters' => [
                'statuses' => count($groupStatuses) > 1 ? OrderStatus::groupOptions($statusGroup) : [],
            ],
            'stats' => array_map(fn(OrderStatus $group) => [
                'value' => $group->value,
                'label' => $group->label(),
                'color' => $group->color(),
                'count' => (int) ($counts[$group->value] ?? 0),
            ], $groupStatuses),
        ]);
    }

    private function canViewFraud(Request $request): bool
    {
        return (bool) $request->user()?->hasPermission('fraud.view');
    }

    public function generateName(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'variant' => ['nullable', 'string', 'max:255'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $variant = trim((string) ($validated['variant'] ?? ''));

        $name = $variant !== '' ? "{$product->name}-{$variant}" : $product->name;

        return response()->json(['name' => $name]);
    }

    public function storeManual(SaveManualOrderData $data, Request $request): OrderData
    {
        $order = $this->createOrderService->execute([
            ...$data->toArray(),
            'type' => OrderType::Manuelle->value,
        ]);

        return OrderData::fromOrder($order->fresh(self::WITH), $this->canViewFraud($request));
    }

    public function update(SaveManualOrderData $data, Order $order, Request $request): OrderData
    {
        abort_unless($order->status->isEditable(), 409, "Cette commande ne peut plus être modifiée.");

        $order = $this->updateOrderService->execute($order, $data->toArray());

        return OrderData::fromOrder($order->loadMissing(self::WITH), $this->canViewFraud($request));
    }

    public function updateStatus(UpdateOrderStatusData $data, Order $order, Request $request): OrderData
    {
        $status = OrderStatus::from($data->status);

        $allowedStatuses = array_filter(
            $order->status->allowedTransitions(),
            fn(OrderStatus $candidate) => $candidate !== OrderStatus::Scheduled
        );

        abort_unless(in_array($status, $allowedStatuses, true), 409, "Cette transition de statut n'est pas autorisée.");

        $order = $this->orderStatusService->change($order, $status, [
            'date_report' => $data->date_report,
        ]);

        return OrderData::fromOrder($order->fresh(self::WITH), $this->canViewFraud($request));
    }

    public function statusHistory(Order $order): DataCollection
    {
        $histories = $order->statusHistories()
            ->with('user')
            ->orderBy('created_at')
            ->get();

        return OrderStatusHistoryData::collect($histories, DataCollection::class);
    }

    public function destroy(Order $order): Response
    {
        abort_unless(
            $order->status->canBeDeleted(),
            409,
            "Seules les commandes au statut « Nouvelle » ou « Annulée » peuvent être supprimées."
        );

        $order->delete();

        return response()->noContent();
    }
}
