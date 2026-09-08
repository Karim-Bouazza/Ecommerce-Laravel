<?php

namespace App\Filament\Pages\Orders;

use App\Enums\OrderStatus;
use App\Filament\Pages\Orders\Concerns\FiltersOrdersByStatus;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Contracts\HasTable;
use UnitEnum;

class EnCoursOrdersPage extends Page implements HasTable
{
    use FiltersOrdersByStatus;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhone;

    protected static ?string $navigationLabel = 'En Cours';

    protected static string|UnitEnum|null $navigationGroup = 'Commandes';

    protected static ?int $navigationSort = 2;

    protected static ?string $title = 'Commandes en cours';

    protected static ?string $slug = 'commandes/en-cours';

    protected string $view = 'filament.pages.orders.status-group';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('orders_en_cours.view') ?? false;
    }

    protected static function statuses(): array
    {
        return [
            OrderStatus::Call1,
            OrderStatus::Call2,
            OrderStatus::Call3,
            OrderStatus::Unreachable,
            OrderStatus::ConfirmedBot,
            OrderStatus::ConfirmedNoStock,
            OrderStatus::Scheduled,
            OrderStatus::Packed,
            OrderStatus::Shipped,
        ];
    }
}
