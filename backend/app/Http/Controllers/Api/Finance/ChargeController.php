<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Controller;
use App\Data\Finance\ChargeData;
use App\Data\Finance\SaveChargeData;
use App\Data\Purchasing\EntryVersementData;
use App\Data\Purchasing\StoreVersementData;
use App\Models\Finance\Charge;
use App\Services\Charges\CalculateChargeAmountService;
use App\Services\Charges\CreateChargeService;
use App\Services\Charges\CreateChargeVersementService;
use App\Services\Charges\DeleteChargeService;
use App\Services\Charges\ToggleChargeActiveService;
use App\Services\Charges\UpdateChargeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use RuntimeException;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\PaginatedDataCollection;

class ChargeController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
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
            ->with(['products:id,name', 'pauses'])
            ->withSum('versements as paid_amount_sum', 'amount')
            ->when($tab === 'recurring', function ($query) {
                $query->whereIn('type', ['per_order', 'recurring']);
            }, function ($query) {
                $query->where('type', 'normal');
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($dateFrom, fn ($query) => $query->whereRaw('COALESCE(starts_at, DATE(created_at)) >= ?', [$dateFrom]))
            ->when($dateTo, fn ($query) => $query->whereRaw('COALESCE(starts_at, DATE(created_at)) <= ?', [$dateTo]))
            ->when($productId, function ($query) use ($productId) {
                $query->where(function ($query) use ($productId) {
                    $query->where('all_products', true)
                        ->orWhereHas('products', fn ($query) => $query->where('products.id', $productId));
                });
            })
            ->when($type, fn ($query) => $query->where('type', $type))
            ->when($category, fn ($query) => $query->where('category', $category))
            ->orderByDesc('created_at');

        // The amount owed by per-order and recurring charges is computed, so the
        // payment status cannot be filtered in SQL.
        $calculator = app(CalculateChargeAmountService::class);

        if ($paymentStatus) {
            $all = $charges->get();
            $calculator->warm($all);

            $charges = $this->paginateCollection(
                $all->filter(fn (Charge $charge) => $charge->paymentStatus()->value === $paymentStatus),
                $perPage,
                $request,
            );
        } else {
            $charges = $charges->paginate($perPage)->withQueryString();
            $calculator->warm($charges->getCollection());
        }

        $charges->through(fn (Charge $charge) => ChargeData::fromCharge($charge));

        return ChargeData::collect($charges, PaginatedDataCollection::class);
    }

    public function stats(): JsonResponse
    {
        $calculator = app(CalculateChargeAmountService::class);

        $byCategory = [];
        $total = 0;

        Charge::query()
            ->with(['products:id', 'pauses'])
            ->chunk(100, function ($charges) use ($calculator, &$byCategory, &$total) {
                $calculator->warm($charges);

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

    public function store(SaveChargeData $data): ChargeData
    {
        $charge = app(CreateChargeService::class)->execute($data);

        return ChargeData::fromCharge($charge->load('products:id,name'));
    }

    public function update(SaveChargeData $data, Charge $charge): ChargeData|JsonResponse
    {
        try {
            $charge = app(UpdateChargeService::class)->execute($charge, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return ChargeData::fromCharge($charge->load('products:id,name'));
    }

    public function toggleActive(Charge $charge): ChargeData
    {
        $charge = app(ToggleChargeActiveService::class)->execute($charge);

        return ChargeData::fromCharge($charge->load('products:id,name'));
    }

    public function destroy(Charge $charge): JsonResponse
    {
        try {
            app(DeleteChargeService::class)->execute($charge);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Charge supprimée.']);
    }

    public function createVersement(StoreVersementData $data, Charge $charge): ChargeData|JsonResponse
    {
        try {
            app(CreateChargeVersementService::class)->execute($charge, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return ChargeData::fromCharge($charge->fresh()->load('products:id,name'));
    }

    public function versements(Charge $charge): DataCollection
    {
        $versements = $charge->versements()
            ->with('wallet')
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return EntryVersementData::collect($versements, DataCollection::class);
    }

    /**
     * @param  Collection<int, Charge>  $items
     */
    private function paginateCollection(Collection $items, int $perPage, Request $request): LengthAwarePaginator
    {
        $page = max(1, (int) $request->input('page', 1));

        return (new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            ['path' => $request->url()],
        ))->withQueryString();
    }
}
