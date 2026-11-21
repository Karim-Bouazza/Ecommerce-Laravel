<?php

namespace App\Support\Query\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class SearchFilter implements Filter
{
    public function __construct(
        private readonly array $columns = [],
        private readonly array $relations = [],
    ) {}

    public function __invoke(Builder $query, $value, string $property): void
    {
        $term = trim(is_array($value) ? implode(',', $value) : (string) $value);

        if ($term === '') {
            return;
        }

        $like = "%{$term}%";

        $query->where(function (Builder $query) use ($like) {
            foreach ($this->columns as $column) {
                $query->orWhere($column, 'like', $like);
            }

            foreach ($this->relations as $relation => $columns) {
                $query->orWhereHas($relation, function (Builder $query) use ($columns, $like) {
                    $query->where(function (Builder $query) use ($columns, $like) {
                        foreach ((array) $columns as $column) {
                            $query->orWhere($column, 'like', $like);
                        }
                    });
                });
            }
        });
    }
}
