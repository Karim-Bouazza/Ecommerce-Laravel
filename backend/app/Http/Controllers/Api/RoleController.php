<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Resources\Role\RoleDetailResource;
use App\Http\Resources\Role\RoleResource;
use App\Models\Role;
use App\Services\Roles\CreateRoleService;
use App\Services\Roles\DeleteRoleService;
use App\Support\PermissionRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class RoleController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('roles.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $roles = Role::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return RoleResource::collection($roles);
    }

    public function permissions(): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('roles.create'), 403);

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

    public function store(StoreRoleRequest $request): RoleDetailResource
    {
        $role = app(CreateRoleService::class)->execute($request->validated());

        return new RoleDetailResource($role);
    }

    public function show(Role $role): RoleDetailResource
    {
        abort_unless(auth()->user()->hasPermission('roles.view'), 403);

        return new RoleDetailResource($role);
    }

    public function destroy(Role $role): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('roles.delete'), 403);

        try {
            app(DeleteRoleService::class)->execute($role);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Rôle supprimé.']);
    }
}
