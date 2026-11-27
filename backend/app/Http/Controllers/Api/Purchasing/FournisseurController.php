<?php

namespace App\Http\Controllers\Api\Purchasing;

use App\Data\Purchasing\FournisseurData;
use App\Data\Purchasing\SaveFournisseurData;
use App\Data\Purchasing\UpdateFournisseurData;
use App\Http\Controllers\Controller;
use App\Models\Purchasing\Fournisseur;
use App\Services\Fournisseurs\CreateFournisseurService;
use App\Services\Fournisseurs\DeleteFournisseurService;
use App\Services\Fournisseurs\UpdateFournisseurService;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class FournisseurController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $fournisseurs = QueryBuilder::for(
            Fournisseur::query()
                ->withSum('completedPurchaseEntries as total_dues_sum', 'total')
                ->withSum('completedPurchaseEntryVersements as entries_paid_amount', 'amount')
                ->withSum('versements as direct_paid_amount', 'amount'),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(AllowedFilter::custom('search', new SearchFilter(['name', 'phone', 'address', 'remark'])))
            ->allowedSorts('name', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $fournisseurs->through(fn (Fournisseur $fournisseur) => FournisseurData::fromFournisseur($fournisseur));

        return FournisseurData::collect($fournisseurs, PaginatedDataCollection::class);
    }

    public function store(SaveFournisseurData $data): FournisseurData
    {
        $fournisseur = app(CreateFournisseurService::class)->execute($data);

        return FournisseurData::fromFournisseur($fournisseur);
    }

    public function update(UpdateFournisseurData $data, Fournisseur $fournisseur): FournisseurData
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
