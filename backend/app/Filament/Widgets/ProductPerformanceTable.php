<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Filament\Widgets\Concerns\InteractsWithDashboardPeriod;
use App\Models\Product;
use Closure;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ProductPerformanceTable extends BaseWidget
{
    use InteractsWithDashboardPeriod;

    protected static ?string $heading = 'Performance des produits';

    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        [$from, $until] = $this->getPeriodRange();

        return $table
            ->query($this->productsQuery($from, $until))
            ->columns([
                TextColumn::make('name')
                    ->label('Produit')
                    ->searchable(),
                TextColumn::make('delivered_qty')
                    ->label('Qté livrée')
                    ->numeric()
                    ->default(0)
                    ->sortable(),
                TextColumn::make('returned_qty')
                    ->label('Qté retournée')
                    ->numeric()
                    ->default(0)
                    ->sortable(),
                TextColumn::make('delivered_orders_count')
                    ->label('Cmd livrées')
                    ->numeric()
                    ->default(0)
                    ->sortable(),
                TextColumn::make('returned_orders_count')
                    ->label('Cmd retournées')
                    ->numeric()
                    ->default(0)
                    ->sortable(),
                TextColumn::make('delivered_percentage')
                    ->label('% Livré')
                    ->state(fn(Product $record) => self::percentage($record->delivered_orders_count, self::totalOrders($record)))
                    ->suffix(' %')
                    ->color('success'),
                TextColumn::make('returned_percentage')
                    ->label('% Retour')
                    ->state(fn(Product $record) => self::percentage($record->returned_orders_count, self::totalOrders($record)))
                    ->suffix(' %')
                    ->color('gray'),
                TextColumn::make('cancelled_percentage')
                    ->label('% Annulé')
                    ->state(fn(Product $record) => self::percentage($record->cancelled_orders_count, self::totalOrders($record)))
                    ->suffix(' %')
                    ->color('danger'),
                TextColumn::make('revenue')
                    ->label('Bénéfice (livré)')
                    ->state(fn(Product $record) => ($record->delivered_qty ?? 0) * ($record->price - ($record->purchase_price ?? 0)))
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->color('success')
                    ->sortable(query: fn(Builder $query, string $direction) => $query->orderByRaw(
                        'delivered_qty * (price - COALESCE(purchase_price, 0)) ' . $direction
                    )),
            ])
            ->defaultSort('delivered_qty', 'desc')
            ->paginated([10, 25, 50]);
    }

    protected function productsQuery(?Carbon $from, ?Carbon $until): Builder
    {
        return Product::query()
            ->withSum(['orderItems as delivered_qty' => $this->orderItemsScope($from, $until, OrderStatus::Delivered)], 'quantity')
            ->withSum(['orderItems as returned_qty' => $this->orderItemsScope($from, $until, OrderStatus::Returned)], 'quantity')
            ->withCount(['orderItems as delivered_orders_count' => $this->orderItemsScope($from, $until, OrderStatus::Delivered)])
            ->withCount(['orderItems as returned_orders_count' => $this->orderItemsScope($from, $until, OrderStatus::Returned)])
            ->withCount(['orderItems as cancelled_orders_count' => $this->orderItemsScope($from, $until, OrderStatus::Cancelled)]);
    }

    protected static function totalOrders(Product $record): int
    {
        return ($record->delivered_orders_count ?? 0) + ($record->returned_orders_count ?? 0) + ($record->cancelled_orders_count ?? 0);
    }

    protected function orderItemsScope(?Carbon $from, ?Carbon $until, ?OrderStatus $status): Closure
    {
        return function (Builder $query) use ($from, $until, $status): void {
            $query->whereHas('order', function (Builder $orderQuery) use ($from, $until, $status): void {
                $orderQuery
                    ->when($from, fn(Builder $q) => $q->whereDate('created_at', '>=', $from))
                    ->when($until, fn(Builder $q) => $q->whereDate('created_at', '<=', $until))
                    ->when($status, fn(Builder $q) => $q->where('status', $status));
            });
        };
    }

    protected static function percentage(?int $numerator, ?int $denominator): string
    {
        if (! $denominator) {
            return '0';
        }

        return number_format(($numerator / $denominator) * 100, 1);
    }
}
