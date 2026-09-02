<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\Communes;
use App\Models\Product;
use App\Models\Wilaya;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Enums\TextSize;
use Filament\Support\RawJs;

class ManualOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Client')
                    ->columns(2)
                    ->schema([
                        TextInput::make('first_name')
                            ->required(),
                        TextInput::make('last_name')
                            ->required(),
                        TextInput::make('phone_number')
                            ->tel()
                            ->mask('9999 99 99 99')
                            ->required(),
                        Select::make('wilaya_id')
                            ->label('Wilaya')
                            ->options(Wilaya::pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->live()
                            ->required()
                            ->afterStateUpdated(function (Set $set, ?string $state) {
                                $set('commune_id', null);
                                $set('delivery_price', Wilaya::find($state)?->price_domicile ?? 0);
                            }),
                        Select::make('commune_id')
                            ->label('Commune')
                            ->options(fn (Get $get) => Communes::where('wilaya_id', $get('wilaya_id'))->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required()
                            ->disabled(fn (Get $get) => blank($get('wilaya_id'))),
                        TextInput::make('delivery_price')
                            ->numeric()
                            ->live()
                            ->mask(RawJs::make("\$money(\$input, ' ', ',', 0)"))
                            ->stripCharacters([' ', '.', ','])
                            ->dehydrateStateUsing(fn (?string $state) => filled($state) ? (int) str_replace([' ', '.', ','], '', $state) : $state)
                            ->suffix('DZ')
                            ->default(0)
                            ->required(),
                    ]),
                Section::make('Produits')
                    ->schema([
                        Repeater::make('items')
                            ->live()
                            ->hiddenLabel()
                            ->schema([
                                Select::make('product_id')
                                    ->label('Produit')
                                    ->options(Product::where('is_active', true)->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->live()
                                    ->required()
                                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('unit_price', Product::find($state)?->price ?? 0)),
                                TextInput::make('quantity')
                                    ->numeric()
                                    ->live()
                                    ->default(1)
                                    ->minValue(1)
                                    ->required(),
                                TextInput::make('unit_price')
                                    ->label('Prix')
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->prefixIcon('heroicon-o-lock-closed')
                                    ->mask(RawJs::make("\$money(\$input, ' ', ',', 0)"))
                                    ->suffix('DZ'),
                            ])
                            ->columns(3)
                            ->minItems(1)
                            ->required()
                            ->addActionLabel('Ajouter un produit'),
                    ]),
                Section::make('Récapitulatif')
                    ->columns(3)
                    ->schema([
                        TextEntry::make('subtotal_display')
                            ->label('Sous-total')
                            ->size(TextSize::Large)
                            ->state(fn (Get $get) => self::formatPrice(self::calculateSubtotal($get('items')))),
                        TextEntry::make('delivery_display')
                            ->label('Livraison')
                            ->size(TextSize::Large)
                            ->state(fn (Get $get) => self::formatPrice(self::parsePrice($get('delivery_price')))),
                        TextEntry::make('total_display')
                            ->label('Total')
                            ->weight(FontWeight::Bold)
                            ->size(TextSize::Large)
                            ->color('primary')
                            ->state(fn (Get $get) => self::formatPrice(
                                self::calculateSubtotal($get('items')) + self::parsePrice($get('delivery_price'))
                            )),
                    ]),
                Textarea::make('note')
                    ->label('Note')
                    ->columnSpanFull(),
            ]);
    }

    private static function calculateSubtotal(?array $items): int
    {
        return collect($items ?? [])
            ->sum(fn (array $item) => ((int) ($item['quantity'] ?? 0)) * (Product::find($item['product_id'] ?? null)?->price ?? 0));
    }

    private static function parsePrice(mixed $value): int
    {
        return (int) str_replace([' ', '.', ','], '', (string) ($value ?? 0));
    }

    private static function formatPrice(int $value): string
    {
        return number_format($value, 0, ',', ' ').' DZ';
    }
}
