<?php

namespace App\Filament\Pages\Inventaire\Concerns;

use App\Enums\PurchaseEntryPaymentStatus;
use App\Models\Fournisseur;
use App\Models\Product;
use App\Models\PurchaseEntry;
use App\Models\Wallet;
use App\Models\Warehouse;
use App\Services\PurchaseEntries\ConfirmPurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryVersementService;
use App\Services\PurchaseEntries\DeletePurchaseEntryService;
use App\Services\PurchaseEntries\UpdatePurchaseEntryService;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\View;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\HtmlString;
use Illuminate\Validation\Rule;
use RuntimeException;

trait InteractsWithPurchaseEntryRecords
{
    /**
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    protected static function purchaseEntryFormSchema(): array
    {
        return [
            Grid::make(2)->schema([
                Select::make('warehouse_id')
                    ->label('Entrepôt')
                    ->options(fn () => Warehouse::query()->pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('fournisseur_id')
                    ->label('Fournisseur de produits')
                    ->options(fn () => Fournisseur::query()->pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->required(),
            ]),
            Textarea::make('remark')
                ->label('Remarque')
                ->rows(3)
                ->columnSpanFull(),
            Repeater::make('items')
                ->label('Produits')
                ->schema([
                    Select::make('product_id')
                        ->label('Nom du produit')
                        ->options(fn () => Product::query()->pluck('name', 'id'))
                        ->searchable()
                        ->preload()
                        ->required()
                        ->columnSpan(4),
                    TextInput::make('variant')
                        ->label('Variante')
                        ->maxLength(255)
                        ->columnSpan(3),
                    TextInput::make('quantity')
                        ->label('Quantité')
                        ->numeric()
                        ->minValue(1)
                        ->default(1)
                        ->required()
                        ->live()
                        ->columnSpan(2),
                    TextInput::make('purchase_price')
                        ->label('Prix d\'achat')
                        ->numeric()
                        ->minValue(0)
                        ->default(0)
                        ->required()
                        ->live()
                        ->columnSpan(3),
                ])
                ->columns(12)
                ->addActionLabel('Ajouter des produits')
                ->reorderable(false)
                ->defaultItems(1)
                ->required()
                ->minItems(1)
                ->live()
                ->columnSpanFull(),
            Placeholder::make('total')
                ->label('Total')
                ->content(function (Get $get): string {
                    $items = $get('items') ?? [];

                    $total = collect($items)->sum(
                        fn (array $item) => (int) ($item['quantity'] ?? 0) * (int) ($item['purchase_price'] ?? 0)
                    );

                    return number_format($total, 0, ',', ' ').' DZD';
                })
                ->columnSpanFull(),
        ];
    }

    protected static function createPurchaseEntryAction(): Action
    {
        return Action::make('createPurchaseEntry')
            ->label('Nouvelle Entrée d\'achat')
            ->icon(Heroicon::Plus)
            ->color('purple')
            ->schema(self::purchaseEntryFormSchema())
            ->modalHeading('Nouvelle Entrée d\'achat')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->modalWidth('3xl')
            ->action(function (array $data): void {
                app(CreatePurchaseEntryService::class)->execute($data);

                Notification::make()
                    ->title('Entrée d\'achat créée')
                    ->success()
                    ->send();
            });
    }

    protected static function editPurchaseEntryAction(): EditAction
    {
        return EditAction::make()
            ->schema(fn () => self::purchaseEntryFormSchema())
            ->modalHeading('Modifier l\'entrée d\'achat')
            ->modalSubmitActionLabel('Enregistrer')
            ->modalCancelActionLabel('Fermer')
            ->modalWidth('3xl')
            ->mutateRecordDataUsing(function (array $data, PurchaseEntry $record): array {
                $data['items'] = $record->items->map(fn ($item) => [
                    'product_id' => $item->product_id,
                    'variant' => $item->variant,
                    'quantity' => $item->quantity,
                    'purchase_price' => $item->purchase_price,
                ])->all();

                return $data;
            })
            ->using(fn (PurchaseEntry $record, array $data) => app(UpdatePurchaseEntryService::class)->execute($record, $data))
            ->visible(fn (PurchaseEntry $record) => $record->isPending())
            ->iconButton()
            ->tooltip('Modifier');
    }

    protected static function deletePurchaseEntryAction(): Action
    {
        return Action::make('deletePurchaseEntry')
            ->label('Supprimer')
            ->tooltip('Supprimer')
            ->icon(Heroicon::OutlinedTrash)
            ->color('danger')
            ->iconButton()
            ->requiresConfirmation()
            ->modalHeading('Supprimer l\'entrée')
            ->modalDescription(fn (PurchaseEntry $record) => $record->isPending()
                ? 'Cette action est irréversible.'
                : 'Cette entrée d\'achat a été complétée et le stock a été ajouté. La supprimer annulera toutes les modifications de stock. Cette action est irréversible.')
            ->modalSubmitActionLabel('Supprimer')
            ->modalCancelActionLabel('Fermer')
            ->visible(fn (PurchaseEntry $record) => $record->isPending() || $record->paymentStatus() === PurchaseEntryPaymentStatus::Unpaid)
            ->action(function (PurchaseEntry $record): void {
                try {
                    app(DeletePurchaseEntryService::class)->execute($record);
                } catch (RuntimeException $e) {
                    Notification::make()
                        ->title($e->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Entrée d\'achat supprimée')
                    ->success()
                    ->send();
            });
    }

    protected static function confirmPurchaseEntryAction(): Action
    {
        return Action::make('confirmPurchaseEntry')
            ->label('Confirmer')
            ->tooltip('Confirmer')
            ->icon(Heroicon::OutlinedCheckCircle)
            ->color('success')
            ->iconButton()
            ->visible(fn (PurchaseEntry $record) => $record->isPending())
            ->modalHeading('Confirmer l\'entrée')
            ->modalDescription('Ceci validera l\'entrée et mettra à jour votre stock de façon permanente.')
            ->modalSubmitActionLabel('Oui')
            ->modalCancelActionLabel('Non')
            ->schema(fn (PurchaseEntry $record) => [
                TextInput::make('confirmation')
                    ->label("Veuillez saisir le texte ci-dessous pour confirmer : {$record->reference}")
                    ->required()
                    ->rule(fn () => Rule::in([$record->reference]))
                    ->validationMessages([
                        'in' => 'Le texte saisi ne correspond pas à la référence.',
                    ]),
            ])
            ->action(function (PurchaseEntry $record): void {
                try {
                    app(ConfirmPurchaseEntryService::class)->execute($record);
                } catch (RuntimeException $e) {
                    Notification::make()
                        ->title($e->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Entrée confirmée')
                    ->success()
                    ->send();
            });
    }

    protected static function viewPurchaseEntryAction(): Action
    {
        return Action::make('viewPurchaseEntry')
            ->label('Détails')
            ->tooltip('Détails')
            ->icon(Heroicon::OutlinedInformationCircle)
            ->color('gray')
            ->iconButton()
            ->visible(fn (PurchaseEntry $record) => ! $record->isPending())
            ->modalHeading('Détails de l\'entrée')
            ->modalSubmitAction(false)
            ->modalCancelActionLabel('Fermer')
            ->modalContent(fn (PurchaseEntry $record) => view('filament.pages.inventaire.partials.purchase-entry-info', [
                'entry' => $record->loadMissing('items.product'),
            ]));
    }

    protected static function purchaseEntryVersementsAction(): Action
    {
        return Action::make('purchaseEntryVersements')
            ->label('Versements')
            ->tooltip('Versements')
            ->icon(Heroicon::OutlinedBanknotes)
            ->color('gray')
            ->iconButton()
            ->modalHeading(fn (PurchaseEntry $record) => "Versements — {$record->reference}")
            ->modalSubmitAction(false)
            ->modalCancelActionLabel('Fermer')
            ->modalContent(fn (PurchaseEntry $record) => view('filament.pages.inventaire.partials.purchase-entry-versements', [
                'entry' => $record->loadMissing('versements.wallet'),
            ]));
    }

    protected static function createPurchaseEntryVersementAction(): Action
    {
        return Action::make('createPurchaseEntryVersement')
            ->label('Créer un versement')
            ->tooltip('Créer un versement')
            ->icon(Heroicon::OutlinedBuildingLibrary)
            ->color('primary')
            ->iconButton()
            ->visible(fn (PurchaseEntry $record) => ! $record->isPending() && $record->remainingAmount() > 0)
            ->modalWidth('2xl')
            ->modalHeading(fn (PurchaseEntry $record) => "Créer un versement — {$record->reference}")
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->schema(function (PurchaseEntry $record) {
                $record->loadMissing('versements.wallet', 'fournisseur');

                return [
                    View::make('filament.pages.inventaire.partials.purchase-entry-versements')
                        ->viewData(['entry' => $record])
                        ->columnSpanFull(),
                    Grid::make(2)->schema([
                        DatePicker::make('date')
                            ->label('Date')
                            ->default(now())
                            ->required(),
                        Select::make('wallet_id')
                            ->label('Portefeuille')
                            ->options(fn () => Wallet::query()->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('amount')
                            ->label('Montant (DZD)')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue($record->remainingAmount())
                            ->default($record->remainingAmount())
                            ->live()
                            ->required(),
                        Textarea::make('remark')
                            ->label('Remarque')
                            ->rows(1),
                        Placeholder::make('payment_hint')
                            ->label('')
                            ->content(function (Get $get) use ($record) {
                                $amount = (int) ($get('amount') ?? 0);

                                if ($amount <= 0) {
                                    return '';
                                }

                                $remaining = $record->remainingAmount();

                                if ($amount >= $remaining) {
                                    return new HtmlString('<div class="pe-versement-hint pe-versement-hint--full">✓ <strong>Full payment</strong></div>');
                                }

                                return new HtmlString(
                                    '<div class="pe-versement-hint pe-versement-hint--partial">⚠ Partial payment — <strong>'
                                    .number_format($remaining - $amount, 0, ',', ' ')
                                    .'</strong> will remain</div>'
                                );
                            })
                            ->columnSpanFull(),
                    ]),
                ];
            })
            ->action(function (PurchaseEntry $record, array $data): void {
                try {
                    app(CreatePurchaseEntryVersementService::class)->execute($record, $data);
                } catch (RuntimeException $e) {
                    Notification::make()
                        ->title($e->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Versement enregistré')
                    ->success()
                    ->send();
            });
    }
}
