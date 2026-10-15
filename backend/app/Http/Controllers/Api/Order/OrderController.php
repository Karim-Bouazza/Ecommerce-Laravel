<?php

namespace App\Http\Controllers\Api\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Order\OrderType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Http\Requests\Order\StoreManualOrderRequest;
use App\Http\Requests\Order\UpdateManualOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Resources\Order\OrderResource;
use App\Http\Resources\Order\OrderStatusHistoryResource;
use App\Jobs\SendOrderToTelegram;
use App\Models\Order\Order;
use App\Models\Order\OrderStatusHistory;
use App\Models\Catalog\Product;
use App\Services\Fraud\FraudDetectionService;
use App\Services\PixelTracking\ExcludedIpMatcher;
use App\Services\Orders\CreateOrderService;
use App\Services\Orders\OrderStatusService;
use App\Services\Orders\UpdateOrderService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

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

        $order = $this->createOrderService->execute(
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
            'track_purchase' => ! $this->excludedIps->matches($request->ip()),
        ], 201);
    }

    public function index(Request $request): AnonymousResourceCollection
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
            auth()->user()->hasPermission('orders.view')
                || ($groupPermission && auth()->user()->hasPermission($groupPermission)),
            403
        );

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $orders = Order::query()
            ->with(self::WITH)
            ->when($statusGroup !== '', function ($query) use ($statusGroup) {
                $query->whereIn('status', array_column(OrderStatus::forGroup($statusGroup), 'value'));
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('client', fn($query) => $query
                            ->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc(
                DB::raw('coalesce((' . OrderStatusHistory::select('created_at')
                    ->whereColumn('order_id', 'orders.id')
                    ->latest('created_at')
                    ->limit(1)
                    ->toSql() . '), created_at)')
            )
            ->paginate($perPage)
            ->withQueryString();

        return OrderResource::collection($orders);
    }

    public function generateName(Request $request): \Illuminate\Http\JsonResponse
    {
        abort_unless(
            auth()->user()->hasPermission('orders.create')
                || auth()->user()->hasPermission('orders.edit'),
            403
        );

        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'variant' => ['nullable', 'string', 'max:255'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $variant = trim((string) ($validated['variant'] ?? ''));

        $name = $variant !== '' ? "{$product->name}-{$variant}" : $product->name;

        return response()->json(['name' => $name]);
    }

    public function storeManual(StoreManualOrderRequest $request): OrderResource
    {
        $data = $request->validated();
        $data['type'] = OrderType::Manuelle->value;

        $order = $this->createOrderService->execute($data);

        return new OrderResource($order->fresh(self::WITH));
    }

    public function update(UpdateManualOrderRequest $request, Order $order): OrderResource
    {
        abort_unless($order->status->isEditable(), 409, "Cette commande ne peut plus être modifiée.");

        $order = $this->updateOrderService->execute($order, $request->validated());

        return new OrderResource($order->loadMissing(self::WITH));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): OrderResource
    {
        $status = OrderStatus::from($request->validated('status'));

        $allowedStatuses = array_filter(
            $order->status->allowedTransitions(),
            fn(OrderStatus $candidate) => $candidate !== OrderStatus::Scheduled
        );

        abort_unless(in_array($status, $allowedStatuses, true), 409, "Cette transition de statut n'est pas autorisée.");

        $order = $this->orderStatusService->change($order, $status, [
            'date_report' => $request->validated('date_report'),
        ]);

        return new OrderResource($order->fresh(self::WITH));
    }

    public function statusHistory(Order $order): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('orders.view'), 403);

        $histories = $order->statusHistories()
            ->with('user')
            ->orderBy('created_at')
            ->get();

        return OrderStatusHistoryResource::collection($histories);
    }

    public function destroy(Order $order): Response
    {
        abort_unless(auth()->user()->hasPermission('orders.delete'), 403);
        abort_unless(
            in_array($order->status, [OrderStatus::New, OrderStatus::Cancelled], true),
            409,
            "Seules les commandes au statut « Nouvelle » ou « Annulée » peuvent être supprimées."
        );

        $order->delete();

        return response()->noContent();
    }
}
