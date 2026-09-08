<?php

namespace App\Filament\Pages\Orders;

use App\Enums\OrderStatus;
use App\Filament\Pages\Orders\Concerns\FiltersOrdersByStatus;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Contracts\HasTable;
use UnitEnum;

class TermineesOrdersPage extends Page implements HasTable
{
    use FiltersOrdersByStatus;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTruck;

    protected static ?string $navigationLabel = 'Terminées';

    protected static string|UnitEnum|null $navigationGroup = 'Commandes';

    protected static ?int $navigationSort = 4;

    protected static ?string $title = 'Commandes terminées';

    protected static ?string $slug = 'commandes/terminees';

    protected string $view = 'filament.pages.orders.status-group';

    protected static function statuses(): array
    {
        return [OrderStatus::Delivered, OrderStatus::Returned];
    }
}
