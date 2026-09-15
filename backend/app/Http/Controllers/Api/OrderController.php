<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\StoreManualOrderRequest;
use App\Http\Requests\UpdateManualOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderStatusHistoryResource;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Services\Orders\CreateOrderService;
use App\Services\Orders\OrderStatusService;
use App\Services\Orders\UpdateOrderService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    protected const WITH = ['client.wilaya', 'client.commune', 'stopDeskCompany', 'items.warehouse', 'latestStatusHistory'];

    public function __construct(
        private readonly CreateOrderService $createOrderService,
        private readonly UpdateOrderService $updateOrderService,
        private readonly OrderStatusService $orderStatusService,
    )
    {
    }

    public function store(CreateOrderRequest $request)
    {
        $order = $this->createOrderService->execute(
            $request->validated()
        );

        return response()->json($order, 201);
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
                        ->orWhereHas('client', fn ($query) => $query
                            ->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc(
                DB::raw('coalesce(('.OrderStatusHistory::select('created_at')
                    ->whereColumn('order_id', 'orders.id')
                    ->latest('created_at')
                    ->limit(1)
                    ->toSql().'), created_at)')
            )
            ->paginate($perPage)
            ->withQueryString();

        return OrderResource::collection($orders);
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
            fn (OrderStatus $candidate) => $candidate !== OrderStatus::Scheduled
        );

        abort_unless(in_array($status, $allowedStatuses, true), 409, "Cette transition de statut n'est pas autorisée.");

        $order = $this->orderStatusService->change($order, $status);

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
        abort_unless($order->status === OrderStatus::New, 409, "Seules les commandes au statut « Nouvelle » peuvent être supprimées.");

        $order->delete();

        return response()->noContent();
    }
}
