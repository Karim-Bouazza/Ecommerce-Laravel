<?php

namespace App\Filament\Pages\Inventaire\Concerns;

use App\Models\Product;
use App\Services\Warehouses\UpdateWarehouseStockService;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;

trait InteractsWithWarehouseStockAction
{
    protected function updateStockAction(): Action
    {
        return Action::make('updateStock')
            ->label('')
            ->icon(Heroicon::OutlinedPencil)
            ->iconButton()
            ->tooltip('Modifier')
            ->modalHeading('Mettre à jour les stocks de produits')
            ->modalSubmitActionLabel('Enregistrer')
            ->modalCancelActionLabel('Fermer')
            ->fillForm(fn (Product $record): array => [
                'current_stock' => $record->warehouse_quantity,
                'adjustment' => 0,
                'purchase_price' => $record->purchase_price,
                'stock_minimum' => $record->warehouse_stock_minimum,
            ])
            ->schema([
                TextInput::make('current_stock')
                    ->label('Stock Actuel')
                    ->disabled()
                    ->dehydrated(false),
                TextInput::make('adjustment')
                    ->label('Nouvelle Quantité')
                    ->numeric()
                    ->required()
                    ->default(0),
                TextInput::make('purchase_price')
                    ->label('Prix d\'achat')
                    ->numeric()
                    ->required(),
                TextInput::make('stock_minimum')
                    ->label('Stock minimum')
                    ->helperText('Une alerte est déclenchée quand le stock interne descend à ce niveau ou en dessous.')
                    ->numeric()
                    ->minValue(0)
                    ->required()
                    ->default(0),
            ])
            ->action(function (Product $record, array $data): void {
                $warehouse = $this->getActiveWarehouse();

                if (! $warehouse) {
                    return;
                }

                app(UpdateWarehouseStockService::class)->execute(
                    $warehouse,
                    $record,
                    (int) $data['adjustment'],
                    (float) $data['purchase_price'],
                    (int) $data['stock_minimum'],
                );

                Notification::make()
                    ->title('Stock mis à jour')
                    ->success()
                    ->send();
            });
    }
}
