<?php

namespace App\Filament\Pages\Orders;

use App\Enums\OrderStatus;
use App\Filament\Pages\Orders\Concerns\FiltersOrdersByStatus;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Contracts\HasTable;
use UnitEnum;

class ConfirmeesOrdersPage extends Page implements HasTable
{
    use FiltersOrdersByStatus;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCheckCircle;

    protected static ?string $navigationLabel = 'Confirmées';

    protected static string|UnitEnum|null $navigationGroup = 'Commandes';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Commandes confirmées';

    protected static ?string $slug = 'commandes/confirmees';

    protected string $view = 'filament.pages.orders.status-group';

    protected static function statuses(): array
    {
        return [OrderStatus::Confirmed];
    }
}
