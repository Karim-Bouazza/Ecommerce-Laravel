<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChargeRequest;
use App\Http\Requests\StoreChargeVersementRequest;
use App\Http\Requests\UpdateChargeRequest;
use App\Http\Resources\ChargeResource;
use App\Http\Resources\ChargeVersementResource;
use App\Models\Charge;
use App\Services\Charges\CalculateChargeAmountService;
use App\Services\Charges\CreateChargeService;
use App\Services\Charges\CreateChargeVersementService;
use App\Services\Charges\DeleteChargeService;
use App\Services\Charges\UpdateChargeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class ChargeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('charges.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));
        $tab = $request->input('tab', 'charges');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $productId = $request->input('product_id');
        $type = $request->input('type');
        $category = $request->input('category');
        $paymentStatus = $request->input('payment_status');

        $charges = Charge::query()
            ->with('products:id,name')
            ->withSum('versements as paid_amount_sum', 'amount')
            ->when($tab === 'recurring', function ($query) {
                $query->whereIn('type', ['per_order', 'recurring']);
            }, function ($query) {
                $query->where('type', 'normal');
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($dateFrom, fn ($query) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn ($query) => $query->whereDate('created_at', '<=', $dateTo))
            ->when($productId, function ($query) use ($productId) {
                $query->where(function ($query) use ($productId) {
                    $query->where('all_products', true)
                        ->orWhereHas('products', fn ($query) => $query->where('products.id', $productId));
                });
            })
            ->when($type, fn ($query) => $query->where('type', $type))
            ->when($category, fn ($query) => $query->where('category', $category))
            ->when($paymentStatus, function ($query) use ($paymentStatus) {
                match ($paymentStatus) {
                    'unpaid' => $query->havingRaw('COALESCE(paid_amount_sum, 0) <= 0'),
                    'partial' => $query->havingRaw('COALESCE(paid_amount_sum, 0) > 0 AND COALESCE(paid_amount_sum, 0) < amount'),
                    'paid' => $query->havingRaw('COALESCE(paid_amount_sum, 0) >= amount'),
                    default => null,
                };
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return ChargeResource::collection($charges);
    }

    public function stats(): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('charges.view'), 403);

        $calculator = app(CalculateChargeAmountService::class);

        $byCategory = [];
        $total = 0;

        Charge::query()
            ->with('products:id')
            ->chunk(100, function ($charges) use ($calculator, &$byCategory, &$total) {
                foreach ($charges as $charge) {
                    $amount = $calculator->execute($charge);
                    $category = $charge->category->value;

                    $byCategory[$category] = ($byCategory[$category] ?? 0) + $amount;
                    $total += $amount;
                }
            });

        return response()->json([
            'total' => $total,
            'by_category' => $byCategory,
        ]);
    }

    public function store(StoreChargeRequest $request): ChargeResource
    {
        $charge = app(CreateChargeService::class)->execute($request->validated());

        return new ChargeResource($charge->load('products:id,name'));
    }

    public function update(UpdateChargeRequest $request, Charge $charge): ChargeResource|JsonResponse
    {
        try {
            $charge = app(UpdateChargeService::class)->execute($charge, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new ChargeResource($charge->load('products:id,name'));
    }

    public function destroy(Charge $charge): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('charges.delete'), 403);

        try {
            app(DeleteChargeService::class)->execute($charge);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Charge supprimée.']);
    }

    public function createVersement(StoreChargeVersementRequest $request, Charge $charge): ChargeResource|JsonResponse
    {
        try {
            app(CreateChargeVersementService::class)->execute($charge, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new ChargeResource($charge->fresh()->load('products:id,name'));
    }

    public function versements(Charge $charge): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('versements.view'), 403);

        $versements = $charge->versements()
            ->with('wallet')
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return ChargeVersementResource::collection($versements);
    }
}
