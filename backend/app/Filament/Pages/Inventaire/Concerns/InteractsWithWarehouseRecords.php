<?php

namespace App\Filament\Pages\Inventaire\Concerns;

use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Wilaya;
use App\Services\Warehouses\CreateWarehouseService;
use App\Services\Warehouses\DeleteWarehouseService;
use App\Services\Warehouses\UpdateWarehouseService;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Support\Icons\Heroicon;

trait InteractsWithWarehouseRecords
{
    /**
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    protected static function warehouseFormSchema(): array
    {
        return [
            TextInput::make('name')
                ->label('Nom')
                ->required()
                ->maxLength(255),
            TextInput::make('phone')
                ->label('Numéro de téléphone')
                ->tel()
                ->maxLength(30),
            TextInput::make('remark')
                ->label('Remarque')
                ->maxLength(255),
            Textarea::make('address')
                ->label('Adresse')
                ->rows(3),
            Toggle::make('all_wilayas')
                ->label('Toutes les wilayas')
                ->live()
                ->default(false),
            Select::make('wilaya_ids')
                ->label('Wilaya')
                ->multiple()
                ->searchable()
                ->preload()
                ->options(fn () => Wilaya::query()->pluck('name', 'id'))
                ->visible(fn (Get $get) => ! $get('all_wilayas'))
                ->dehydrated(fn (Get $get) => ! $get('all_wilayas')),
            Toggle::make('all_products')
                ->label('Tous les produits')
                ->live()
                ->default(false),
            Select::make('product_ids')
                ->label('Produit')
                ->multiple()
                ->searchable()
                ->preload()
                ->options(fn () => Product::query()->pluck('name', 'id'))
                ->visible(fn (Get $get) => ! $get('all_products'))
                ->dehydrated(fn (Get $get) => ! $get('all_products')),
        ];
    }

    protected static function createWarehouseAction(): Action
    {
        return Action::make('createWarehouse')
            ->label('Nouvel entrepôt')
            ->icon(Heroicon::Plus)
            ->color('purple')
            ->schema(self::warehouseFormSchema())
            ->modalHeading('Nouvel entrepôt')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (array $data): void {
                app(CreateWarehouseService::class)->execute($data);

                Notification::make()
                    ->title('Entrepôt créé')
                    ->success()
                    ->send();
            });
    }

    protected static function editWarehouseAction(): EditAction
    {
        return EditAction::make()
            ->schema(fn () => self::warehouseFormSchema())
            ->modalHeading('Modifier l’entrepôt')
            ->modalSubmitActionLabel('Enregistrer')
            ->modalCancelActionLabel('Fermer')
            ->mutateRecordDataUsing(function (array $data, Warehouse $record): array {
                $data['wilaya_ids'] = $record->wilayas()->pluck('wilayas.id')->all();
                $data['product_ids'] = $record->products()->pluck('products.id')->all();

                return $data;
            })
            ->using(fn (Warehouse $record, array $data) => app(UpdateWarehouseService::class)->execute($record, $data))
            ->iconButton()
            ->tooltip('Modifier');
    }

    protected static function deleteWarehouseAction(): Action
    {
        return Action::make('deleteWarehouse')
            ->label('Supprimer')
            ->tooltip('Supprimer')
            ->icon(Heroicon::OutlinedTrash)
            ->color('danger')
            ->iconButton()
            ->requiresConfirmation()
            ->modalSubmitActionLabel('Supprimer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (Warehouse $record): void {
                app(DeleteWarehouseService::class)->execute($record);

                Notification::make()
                    ->title('Entrepôt supprimé')
                    ->success()
                    ->send();
            });
    }
}
