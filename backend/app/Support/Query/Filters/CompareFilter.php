<?php

namespace App\Support\Query\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class CompareFilter implements Filter
{
    public function __construct(
        private readonly string $column,
        private readonly string $operator,
        private readonly bool $aggregate = false,
    ) {}

    public static function min(string $column, bool $aggregate = false): self
    {
        return new self($column, '>=', $aggregate);
    }

    public static function max(string $column, bool $aggregate = false): self
    {
        return new self($column, '<=', $aggregate);
    }

    public function __invoke(Builder $query, $value, string $property): void
    {
        $value = is_array($value) ? implode(',', $value) : $value;

        if ($this->aggregate) {
            $query->havingRaw("{$this->column} {$this->operator} ?", [$value]);

            return;
        }

        $query->whereRaw("{$this->column} {$this->operator} ?", [$value]);
    }
}
