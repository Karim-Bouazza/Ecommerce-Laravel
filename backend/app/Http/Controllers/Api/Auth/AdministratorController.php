<?php

namespace App\Http\Controllers\Api\Auth;

use App\Data\Auth\AdministratorData;
use App\Data\Auth\IndexAdministratorData;
use App\Data\Auth\StoreAdministratorData;
use App\Data\Auth\UpdateAdministratorData;
use App\Http\Controllers\Controller;
use App\Models\Users\User;
use App\Queries\Administrators\AdministratorIndexQuery;
use App\Services\Administrateurs\CreateAdministrateurService;
use App\Services\Administrateurs\DeleteAdministrateurService;
use App\Services\Administrateurs\ToggleAdministrateurActiveService;
use App\Services\Administrateurs\UpdateAdministrateurService;
use App\Support\PermissionRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\Permission\Models\Role;

class AdministratorController extends Controller
{
    public function index(IndexAdministratorData $data, AdministratorIndexQuery $query, Request $request): PaginatedDataCollection
    {
        $administrators = $query->paginate($data->toArray());

        $administrators->through(fn (User $user) => AdministratorData::fromUser($user, $request->user()));

        return AdministratorData::collect($administrators, PaginatedDataCollection::class);
    }

    /**
     * Roles an administrator can be assigned to.
     */
    public function roleOptions(): JsonResponse
    {
        return response()->json(
            Role::query()->orderBy('name')->get(['id', 'name'])->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'is_system' => PermissionRegistry::isSystemRole($role->name),
            ])
        );
    }

    public function store(StoreAdministratorData $data, Request $request): AdministratorData
    {
        $user = app(CreateAdministrateurService::class)->execute($data);

        return AdministratorData::fromUser($user, $request->user());
    }

    public function update(UpdateAdministratorData $data, User $administrator, Request $request): AdministratorData|JsonResponse
    {
        try {
            $user = app(UpdateAdministrateurService::class)->execute($administrator, $data, $request->user());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return AdministratorData::fromUser($user, $request->user());
    }

    public function toggleActive(User $administrator, Request $request): AdministratorData|JsonResponse
    {
        try {
            $user = app(ToggleAdministrateurActiveService::class)->execute($administrator, auth()->user());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return AdministratorData::fromUser($user, $request->user());
    }

    public function destroy(User $administrator): JsonResponse
    {
        try {
            app(DeleteAdministrateurService::class)->execute($administrator, auth()->user());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Administrateur supprimé.']);
    }
}
