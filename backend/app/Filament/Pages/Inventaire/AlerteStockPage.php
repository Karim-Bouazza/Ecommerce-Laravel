<?php

namespace App\Filament\Pages\Inventaire;

use App\Filament\Pages\Inventaire\Concerns\InteractsWithWarehouseStockAction;
use App\Filament\Pages\Inventaire\Concerns\InteractsWithWarehouseTabs;
use App\Models\Product;
use App\Services\Warehouses\WarehouseStockQueryService;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class AlerteStockPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithWarehouseStockAction;
    use InteractsWithWarehouseTabs;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedExclamationTriangle;

    protected static ?string $navigationLabel = 'Alerte de Stock';

    protected static string|UnitEnum|null $navigationGroup = 'Inventaire';

    protected static ?int $navigationSort = 4;

    protected static ?string $title = 'Alerte de Stock';

    protected static ?string $slug = 'inventaire/alerte-de-stock';

    protected string $view = 'filament.pages.inventaire.alerte-stock';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('alerte_stock.view') ?? false;
    }

    public function table(Table $table): Table
    {
        $warehouse = $this->getActiveWarehouse();

        return $table
            ->query($warehouse
                ? app(WarehouseStockQueryService::class)->lowStockQuery($warehouse)
                : Product::query()->whereRaw('1 = 0'))
            ->searchPlaceholder('Rechercher Code, Nom, Description')
            ->columns([
                ImageColumn::make('image_1')
                    ->label('Image')
                    ->disk('public'),
                TextColumn::make('name')
                    ->label('Nom du produit')
                    ->searchable(),
                TextColumn::make('warehouse_stock_minimum')
                    ->label('Stock minimum')
                    ->numeric()
                    ->alignCenter(),
                TextColumn::make('warehouse_quantity')
                    ->label('Stock interne')
                    ->numeric()
                    ->description('0 Réservé')
                    ->color('danger')
                    ->weight(FontWeight::Bold)
                    ->alignCenter(),
                TextColumn::make('sold')
                    ->label('Vendu')
                    ->state(fn () => 0)
                    ->alignCenter(),
                TextColumn::make('in_delivery')
                    ->label('Stock en livraison')
                    ->state(fn () => 0)
                    ->description('0 En retour')
                    ->alignCenter(),
            ])
            ->recordActions([
                $this->updateStockAction(),
            ])
            ->emptyStateHeading($warehouse ? 'Aucune alerte' : 'Aucun entrepôt')
            ->emptyStateDescription($warehouse
                ? 'Tous les produits de cet entrepôt respectent leur stock minimum.'
                : 'Créez un entrepôt depuis la page Entrepôts pour commencer.')
            ->emptyStateIcon(Heroicon::OutlinedCheckCircle);
    }

    public static function getNavigationBadge(): ?string
    {
        $count = app(WarehouseStockQueryService::class)->totalLowStockCount();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }
}
