<?php

namespace App\Queries\Administrators;

use App\Models\Users\User;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class AdministratorIndexQuery
{
    public function paginate(Request $request): LengthAwarePaginator
    {
        return QueryBuilder::for(
            User::query()->with(['roles:id,name', 'media']),
            ListQuery::request($request, ['search', 'role_id', 'status']),
        )
            ->allowedFilters(
                AllowedFilter::custom('search', new SearchFilter(['name', 'email', 'phone'])),
                AllowedFilter::callback('role_id', fn (Builder $query, $value) => $query->whereHas('roles', fn ($roles) => $roles->whereKey($value))),
                AllowedFilter::callback('status', fn (Builder $query, $value) => match ($value) {
                    'active' => $query->where('is_active', true),
                    'inactive' => $query->where('is_active', false),
                    default => $query,
                }),
            )
            ->allowedSorts('name', 'email', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();
    }
}
