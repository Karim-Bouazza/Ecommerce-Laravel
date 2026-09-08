<?php

namespace App\Filament\Pages\Orders;

use App\Enums\OrderStatus;
use App\Filament\Pages\Orders\Concerns\FiltersOrdersByStatus;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Contracts\HasTable;
use UnitEnum;

class AnnuleesOrdersPage extends Page implements HasTable
{
    use FiltersOrdersByStatus;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedXCircle;

    protected static ?string $navigationLabel = 'Annulée';

    protected static string|UnitEnum|null $navigationGroup = 'Commandes';

    protected static ?int $navigationSort = 5;

    protected static ?string $title = 'Commandes annulées';

    protected static ?string $slug = 'commandes/annulees';

    protected string $view = 'filament.pages.orders.status-group';

    protected static function statuses(): array
    {
        return [OrderStatus::Cancelled, OrderStatus::Duplicated, OrderStatus::FakeOrder];
    }
}
