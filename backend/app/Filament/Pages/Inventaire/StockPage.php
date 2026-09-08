<?php

namespace App\Filament\Pages\Inventaire;

use App\Filament\Pages\Inventaire\Concerns\InteractsWithWarehouseStockAction;
use App\Filament\Pages\Inventaire\Concerns\InteractsWithWarehouseTabs;
use App\Models\Product;
use App\Services\Warehouses\WarehouseStockQueryService;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class StockPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithWarehouseStockAction;
    use InteractsWithWarehouseTabs;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArchiveBox;

    protected static ?string $navigationLabel = 'Stock';

    protected static string|UnitEnum|null $navigationGroup = 'Inventaire';

    protected static ?int $navigationSort = 2;

    protected static ?string $title = 'Stock';

    protected static ?string $slug = 'inventaire/stock';

    protected string $view = 'filament.pages.inventaire.stock';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('stock.view') ?? false;
    }

    public function table(Table $table): Table
    {
        $warehouse = $this->getActiveWarehouse();

        return $table
            ->query($warehouse
                ? app(WarehouseStockQueryService::class)->productsQuery($warehouse)
                : Product::query()->whereRaw('1 = 0'))
            ->searchPlaceholder('Rechercher Code, Nom, Description')
            ->columns([
                ImageColumn::make('image_1')
                    ->label('Image')
                    ->disk('public'),
                TextColumn::make('name')
                    ->label('Nom du produit')
                    ->searchable(),
                TextColumn::make('warehouse_quantity')
                    ->label('Stock interne')
                    ->numeric()
                    ->description('0 Réservé')
                    ->alignCenter(),
                TextColumn::make('in_delivery')
                    ->label('Stock en livraison')
                    ->state(fn () => 0)
                    ->description('0 En retour')
                    ->alignCenter(),
                TextColumn::make('missing')
                    ->label('Stock manquant')
                    ->state(fn () => 0)
                    ->alignCenter(),
                TextColumn::make('confirmed_no_stock')
                    ->label('Confirmé sans stock')
                    ->state(fn () => 0)
                    ->alignCenter(),
                TextColumn::make('sold')
                    ->label('Vendu')
                    ->state(fn () => 0)
                    ->alignCenter(),
                TextColumn::make('purchase_price')
                    ->label('Prix d\'achat (DZD)')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->placeholder('-')
                    ->alignCenter(),
                TextColumn::make('stock_value')
                    ->label('Valeur du stock')
                    ->state(fn (Product $record) => $record->warehouse_quantity * ($record->purchase_price ?? 0))
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->alignCenter(),
                TextColumn::make('in_delivery_value')
                    ->label('Valeur en livraison')
                    ->state(fn () => 0)
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->alignCenter(),
            ])
            ->recordActions([
                $this->updateStockAction(),
            ])
            ->emptyStateHeading($warehouse ? 'Aucun produit' : 'Aucun entrepôt')
            ->emptyStateDescription($warehouse ? null : 'Créez un entrepôt depuis la page Entrepôts pour commencer.');
    }
}
