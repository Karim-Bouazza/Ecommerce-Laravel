<?php

namespace App\Filament\Pages\Orders;

use App\Enums\OrderStatus;
use App\Filament\Pages\Orders\Concerns\FiltersOrdersByStatus;
use App\Filament\Resources\Orders\OrderResource;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Contracts\HasTable;
use UnitEnum;

class NouvellesOrdersPage extends Page implements HasTable
{
    use FiltersOrdersByStatus;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInbox;

    protected static ?string $navigationLabel = 'Nouvelles';

    protected static string|UnitEnum|null $navigationGroup = 'Commandes';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Nouvelles commandes';

    protected static ?string $slug = 'commandes/nouvelles';

    protected string $view = 'filament.pages.orders.status-group';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('orders_nouvelles.view') ?? false;
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('createOrder')
                ->label('Ajouter commande')
                ->icon(Heroicon::OutlinedPlus)
                ->url(fn () => OrderResource::getUrl('create'))
                ->visible(fn () => auth()->user()?->hasPermission('orders.create') ?? false),
        ];
    }

    protected static function statuses(): array
    {
        return [OrderStatus::Pending, OrderStatus::ToCheck];
    }
}
