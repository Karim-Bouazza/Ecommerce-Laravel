<?php

namespace App\Filament\Resources\Orders;

use App\Enums\OrderStatus;
use App\Filament\Resources\Orders\Pages\CreateOrder;
use App\Filament\Resources\Orders\Pages\EditOrder;
use App\Filament\Resources\Orders\Pages\ListOrders;
use App\Filament\Resources\Orders\Pages\ViewOrder;
use App\Filament\Resources\Orders\Schemas\OrderForm;
use App\Filament\Resources\Orders\Schemas\OrderInfolist;
use App\Filament\Resources\Orders\Tables\OrdersTable;
use App\Models\Order;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use UnitEnum;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;

    protected static ?string $navigationLabel = 'Tous';

    protected static string|UnitEnum|null $navigationGroup = 'Commandes';

    protected static ?int $navigationSort = 6;

    protected static ?string $recordTitleAttribute = 'reference';

    public static function getNavigationBadge(): ?string
    {
        $count = Order::query()->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function form(Schema $schema): Schema
    {
        return OrderForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return OrderInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OrdersTable::configure($table);
    }

    public static function canViewAny(): bool
    {
        return auth()->user()?->hasPermission('orders.view') ?? false;
    }

    public static function canCreate(): bool
    {
        return auth()->user()?->hasPermission('orders.create') ?? false;
    }

    public static function canEdit(Model $record): bool
    {
        if (! (auth()->user()?->hasPermission('orders.edit') ?? false)) {
            return false;
        }

        return in_array($record->status, [
            OrderStatus::Pending,
            OrderStatus::Call1,
            OrderStatus::Call2,
            OrderStatus::Call3,
            OrderStatus::Unreachable,
            OrderStatus::ToCheck,
            OrderStatus::ConfirmedNoStock,
            OrderStatus::Scheduled,
            OrderStatus::Confirmed,
            OrderStatus::ConfirmedBot,
        ], true);
    }

    public static function canView(Model $record): bool
    {
        return auth()->user()?->hasPermission('orders.view') ?? false;
    }

    public static function canDelete(Model $record): bool
    {
        return auth()->user()?->hasPermission('orders.delete') ?? false;
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOrders::route('/'),
            'create' => CreateOrder::route('/create'),
            'view' => ViewOrder::route('/{record}'),
            'edit' => EditOrder::route('/{record}/edit'),
        ];
    }
}
