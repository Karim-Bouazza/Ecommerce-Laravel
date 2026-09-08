<?php

namespace App\Filament\Pages\Products;

use App\Enums\OrderStatus;
use App\Models\OrderItem;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ProductsToPurchasePage extends Page implements HasTable
{
    use InteractsWithTable;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingCart;

    protected static ?string $navigationLabel = 'Produits à commander';

    protected static ?string $title = 'Produits à commander';

    protected static ?string $slug = 'produits-a-commander';

    protected string $view = 'filament.pages.products-to-purchase';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('products_to_purchase.view') ?? false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query($this->getRestockQuery())
            ->description('Quantités à racheter pour les produits en rupture de stock ayant des commandes confirmées sans stock, détaillées par variante.')
            ->columns([
                TextColumn::make('variant')
                    ->label('Variante')
                    ->placeholder('Sans variante')
                    ->weight('medium'),
                TextColumn::make('orders_count')
                    ->label('Commandes')
                    ->badge()
                    ->color('gray')
                    ->alignCenter(),
                TextColumn::make('total_quantity')
                    ->label('Quantité à commander')
                    ->badge()
                    ->color('danger')
                    ->alignCenter()
                    ->sortable()
                    ->summarize(Sum::make()->label('Total')),
                TextColumn::make('purchase_price')
                    ->label('Prix d\'achat')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->alignEnd()
                    ->sortable(),
                TextColumn::make('total_cost')
                    ->label('Total à payer')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->weight('medium')
                    ->alignEnd()
                    ->sortable()
                    ->summarize(
                        Sum::make()
                            ->label('Total')
                            ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ),
            ])
            ->defaultGroup(
                Group::make('product_id')
                    ->label('Produit')
                    ->getTitleFromRecordUsing(fn (OrderItem $record) => $record->product_name)
                    ->collapsible()
            )
            ->collapsedGroupsByDefault()
            ->groupingSettingsHidden()
            ->defaultSort('variant')
            ->emptyStateHeading('Rien à commander')
            ->emptyStateDescription('Aucun produit en rupture de stock n\'a de commande confirmée sans stock en attente.')
            ->emptyStateIcon(Heroicon::OutlinedShoppingCart);
    }

    protected function getRestockQuery(): Builder
    {
        return OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->where('orders.status', OrderStatus::ConfirmedNoStock->value)
            ->where('products.stock', 0)
            ->groupBy('products.id', 'order_items.variant')
            ->orderBy('product_name')
            ->select([
                DB::raw('min(order_items.id) as id'),
                'products.id as product_id',
                DB::raw('min(products.name) as product_name'),
                'order_items.variant',
                DB::raw('sum(order_items.quantity) as total_quantity'),
                DB::raw('count(distinct order_items.order_id) as orders_count'),
                DB::raw('min(products.purchase_price) as purchase_price'),
                DB::raw('min(products.purchase_price) * sum(order_items.quantity) as total_cost'),
            ]);
    }
}
