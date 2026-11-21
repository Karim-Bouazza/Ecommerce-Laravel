<?php

namespace App\Support\Query\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class DateFilter implements Filter
{
    public function __construct(
        private readonly string $column,
        private readonly string $operator,
    ) {}

    public static function from(string $column): self
    {
        return new self($column, '>=');
    }

    public static function to(string $column): self
    {
        return new self($column, '<=');
    }

    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->whereDate($this->column, $this->operator, is_array($value) ? implode(',', $value) : $value);
    }
}
