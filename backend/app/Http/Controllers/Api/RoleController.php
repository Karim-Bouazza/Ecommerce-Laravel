<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Role\RoleDetailResource;
use App\Http\Resources\Role\RoleResource;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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

    public function show(Role $role): RoleDetailResource
    {
        abort_unless(auth()->user()->hasPermission('roles.view'), 403);

        return new RoleDetailResource($role);
    }
}
