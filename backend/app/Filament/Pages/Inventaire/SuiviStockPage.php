<?php

namespace App\Filament\Pages\Inventaire;

use App\Enums\StockMovementType;
use App\Filament\Pages\Inventaire\Concerns\InteractsWithWarehouseTabs;
use App\Models\Warehouse;
use App\Models\WarehouseStockMovement;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class SuiviStockPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithWarehouseTabs;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static ?string $navigationLabel = 'Suivi de Stock';

    protected static string|UnitEnum|null $navigationGroup = 'Inventaire';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Suivi de Stock';

    protected static ?string $slug = 'inventaire/suivi-de-stock';

    protected string $view = 'filament.pages.inventaire.suivi-stock';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('suivi_stock.view') ?? false;
    }

    public function table(Table $table): Table
    {
        $warehouse = $this->getActiveWarehouse();

        return $table
            ->query($warehouse ? $this->movementsQuery($warehouse) : WarehouseStockMovement::query()->whereRaw('1 = 0'))
            ->searchPlaceholder('Rechercher Code, Nom, Éditeur')
            ->columns([
                TextColumn::make('created_at')
                    ->label('Date de création')
                    ->dateTime('Y-m-d H:i:s')
                    ->sortable(),
                TextColumn::make('product.name')
                    ->label('Nom du produit')
                    ->searchable(),
                TextColumn::make('quantity')
                    ->label('Quantité')
                    ->badge()
                    ->formatStateUsing(fn (WarehouseStockMovement $record) => $record->type === StockMovementType::Out
                        ? "-{$record->quantity}"
                        : "+{$record->quantity}")
                    ->color(fn (WarehouseStockMovement $record) => $record->type->color()),
                TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn (StockMovementType $state) => mb_strtoupper($state->label()))
                    ->color(fn (StockMovementType $state) => $state->color())
                    ->icon(fn (StockMovementType $state) => $state->icon()),
                TextColumn::make('resulting_quantity')
                    ->label('Stock interne')
                    ->numeric()
                    ->alignCenter(),
                TextColumn::make('in_delivery')
                    ->label('Stock en livraison')
                    ->state(fn () => 0)
                    ->alignCenter(),
                TextColumn::make('sold')
                    ->label('Vendu')
                    ->state(fn () => 0)
                    ->alignCenter(),
                TextColumn::make('creator.name')
                    ->label('Éditeur')
                    ->searchable()
                    ->badge()
                    ->color('primary')
                    ->placeholder('—'),
            ])
            ->defaultSort('created_at', 'desc')
            ->emptyStateHeading($warehouse ? 'Aucun mouvement de stock' : 'Aucun entrepôt')
            ->emptyStateDescription($warehouse ? null : 'Créez un entrepôt depuis la page Entrepôts pour commencer.');
    }

    protected function movementsQuery(Warehouse $warehouse): Builder
    {
        return WarehouseStockMovement::query()
            ->with(['product', 'creator'])
            ->where('warehouse_id', $warehouse->id);
    }
}
