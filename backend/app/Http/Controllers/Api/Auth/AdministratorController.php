<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\IndexAdministratorRequest;
use App\Http\Requests\Auth\StoreAdministratorRequest;
use App\Http\Requests\Auth\UpdateAdministratorRequest;
use App\Http\Resources\Auth\AdministratorResource;
use App\Models\Auth\Role;
use App\Models\Users\User;
use App\Queries\Administrators\AdministratorIndexQuery;
use App\Services\Administrateurs\CreateAdministrateurService;
use App\Services\Administrateurs\DeleteAdministrateurService;
use App\Services\Administrateurs\ToggleAdministrateurActiveService;
use App\Services\Administrateurs\UpdateAdministrateurService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class AdministratorController extends Controller
{
    public function index(IndexAdministratorRequest $request, AdministratorIndexQuery $query): AnonymousResourceCollection
    {
        return AdministratorResource::collection($query->paginate($request->validated()));
    }

    /**
     * Roles an administrator can be assigned to.
     */
    public function roleOptions(): JsonResponse
    {
        $user = auth()->user();

        abort_unless(
            $user->hasPermission('administrateurs.view')
                || $user->hasPermission('administrateurs.create')
                || $user->hasPermission('administrateurs.edit'),
            403
        );

        return response()->json(
            Role::query()->orderBy('name')->get(['id', 'name', 'is_system'])
        );
    }

    public function store(StoreAdministratorRequest $request): AdministratorResource
    {
        $user = app(CreateAdministrateurService::class)->execute($request->validated());

        return new AdministratorResource($user);
    }

    public function update(UpdateAdministratorRequest $request, User $administrator): AdministratorResource|JsonResponse
    {
        try {
            $user = app(UpdateAdministrateurService::class)->execute($administrator, $request->validated(), $request->user());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new AdministratorResource($user);
    }

    public function toggleActive(User $administrator): AdministratorResource|JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('administrateurs.edit'), 403);

        try {
            $user = app(ToggleAdministrateurActiveService::class)->execute($administrator, auth()->user());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new AdministratorResource($user);
    }

    public function destroy(User $administrator): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('administrateurs.delete'), 403);

        try {
            app(DeleteAdministrateurService::class)->execute($administrator, auth()->user());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Administrateur supprimé.']);
    }
}
