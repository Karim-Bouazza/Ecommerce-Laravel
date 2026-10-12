<?php

namespace App\Services\Storefront;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ReorderStorefrontItemsService
{
    /**
     * Gives each id its index as position; ids outside the query are ignored,
     * items missing from the list keep their relative order after the others.
     *
     * @param  array<int, int>  $ids
     */
    public function execute(Builder $query, array $ids): void
    {
        DB::transaction(function () use ($query, $ids) {
            $items = (clone $query)->orderBy('position')->orderBy('id')->get();
            $ordered = $items->sortBy(function ($item) use ($ids) {
                $index = array_search($item->id, $ids, true);

                return $index === false ? count($ids) + $item->position : $index;
            })->values();

            foreach ($ordered as $position => $item) {
                if ($item->position !== $position + 1) {
                    $item->update(['position' => $position + 1]);
                }
            }
        });
    }
}
