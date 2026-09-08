<?php

namespace App\Filament\Pages\Orders\Concerns;

use App\Enums\OrderStatus;
use App\Filament\Resources\Orders\Tables\OrdersTable;
use App\Models\Order;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

trait FiltersOrdersByStatus
{
    use InteractsWithTable;

    /**
     * @return array<int, OrderStatus>
     */
    abstract protected static function statuses(): array;

    public function table(Table $table): Table
    {
        return OrdersTable::configure($table)->query(static::baseQuery());
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::baseQuery()->count();

        return $count > 0 ? (string) $count : null;
    }

    private static function baseQuery(): Builder
    {
        return Order::query()->whereIn(
            'status',
            array_map(fn (OrderStatus $status) => $status->value, static::statuses()),
        );
    }
}
