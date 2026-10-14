<?php

namespace App\Queries\Administrators;

use App\Models\Users\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdministratorIndexQuery
{
    /**
     * @param  array{search?: ?string, role_id?: ?int, status?: ?string, per_page?: ?int}  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return User::query()
            ->with('role:id,name,is_system')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($filters['role_id'] ?? null, fn ($query, $roleId) => $query->where('role_id', $roleId))
            ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 15)
            ->withQueryString();
    }
}
