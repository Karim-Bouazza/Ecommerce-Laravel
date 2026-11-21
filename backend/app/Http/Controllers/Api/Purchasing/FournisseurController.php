<?php

namespace App\Http\Controllers\Api\Purchasing;

use App\Http\Controllers\Controller;
use App\Data\Purchasing\FournisseurData;
use App\Data\Purchasing\SaveFournisseurData;
use App\Models\Purchasing\Fournisseur;
use App\Services\Fournisseurs\CreateFournisseurService;
use App\Services\Fournisseurs\DeleteFournisseurService;
use App\Services\Fournisseurs\UpdateFournisseurService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class FournisseurController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $fournisseurs = Fournisseur::query()
            ->withSum('completedPurchaseEntries as total_dues_sum', 'total')
            ->withSum('completedPurchaseEntryVersements as entries_paid_amount', 'amount')
            ->withSum('versements as direct_paid_amount', 'amount')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%")
                        ->orWhere('remark', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $fournisseurs->through(fn (Fournisseur $fournisseur) => FournisseurData::fromFournisseur($fournisseur));

        return FournisseurData::collect($fournisseurs, PaginatedDataCollection::class);
    }

    public function store(SaveFournisseurData $data): FournisseurData
    {
        $fournisseur = app(CreateFournisseurService::class)->execute($data);

        return FournisseurData::fromFournisseur($fournisseur);
    }

    public function update(SaveFournisseurData $data, Fournisseur $fournisseur): FournisseurData
    {
        $fournisseur = app(UpdateFournisseurService::class)->execute($fournisseur, $data);

        return FournisseurData::fromFournisseur($fournisseur);
    }

    public function destroy(Fournisseur $fournisseur): JsonResponse
    {
        app(DeleteFournisseurService::class)->execute($fournisseur);

        return response()->json(['message' => 'Fournisseur supprimé.']);
    }
}
