<?php

namespace App\Http\Controllers\Api\Auth;

use App\Data\Auth\RoleData;
use App\Data\Auth\RoleDetailData;
use App\Data\Auth\SaveRoleData;
use App\Data\Auth\UpdateRoleData;
use App\Http\Controllers\Controller;
use App\Services\Roles\CreateRoleService;
use App\Services\Roles\DeleteRoleService;
use App\Services\Roles\UpdateRoleService;
use App\Support\PermissionRegistry;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\Permission\Models\Role;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RoleController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $roles = QueryBuilder::for(
            Role::query()->with('permissions:id,name'),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(AllowedFilter::custom('search', new SearchFilter(['name'])))
            ->allowedSorts('name', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $roles->through(fn (Role $role) => RoleData::fromRole($role));

        return RoleData::collect($roles, PaginatedDataCollection::class);
    }

    public function permissions(): JsonResponse
    {
        $groups = collect(PermissionRegistry::grouped())
            ->map(fn (array $permissions, string $group) => [
                'group' => $group,
                'permissions' => collect($permissions)
                    ->map(fn (string $label, string $key) => ['key' => $key, 'label' => $label])
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();

        return response()->json($groups);
    }

    public function store(SaveRoleData $data): RoleDetailData
    {
        $role = app(CreateRoleService::class)->execute($data);

        return RoleDetailData::fromRole($role);
    }

    public function show(Role $role): RoleDetailData
    {
        return RoleDetailData::fromRole($role);
    }

    public function update(UpdateRoleData $data, Role $role): RoleDetailData|JsonResponse
    {
        try {
            $role = app(UpdateRoleService::class)->execute($role, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return RoleDetailData::fromRole($role);
    }

    public function destroy(Role $role): JsonResponse
    {
        try {
            app(DeleteRoleService::class)->execute($role);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Rôle supprimé.']);
    }
}
