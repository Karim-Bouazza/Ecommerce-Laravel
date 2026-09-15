<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFournisseurRequest;
use App\Http\Requests\UpdateFournisseurRequest;
use App\Http\Resources\FournisseurResource;
use App\Models\Fournisseur;
use App\Services\Fournisseurs\CreateFournisseurService;
use App\Services\Fournisseurs\DeleteFournisseurService;
use App\Services\Fournisseurs\UpdateFournisseurService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FournisseurController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('fournisseurs.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $fournisseurs = Fournisseur::query()
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

        return FournisseurResource::collection($fournisseurs);
    }

    public function store(StoreFournisseurRequest $request): FournisseurResource
    {
        $fournisseur = app(CreateFournisseurService::class)->execute($request->validated());

        return new FournisseurResource($fournisseur);
    }

    public function update(UpdateFournisseurRequest $request, Fournisseur $fournisseur): FournisseurResource
    {
        $fournisseur = app(UpdateFournisseurService::class)->execute($fournisseur, $request->validated());

        return new FournisseurResource($fournisseur);
    }

    public function destroy(Fournisseur $fournisseur): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('fournisseurs.delete'), 403);

        app(DeleteFournisseurService::class)->execute($fournisseur);

        return response()->json(['message' => 'Fournisseur supprimé.']);
    }
}
