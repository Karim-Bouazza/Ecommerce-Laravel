<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Enums\OrderStatus;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Order')
                    ->columns(4)
                    ->schema([
                        TextEntry::make('reference'),
                        TextEntry::make('status')
                            ->badge()
                            ->formatStateUsing(fn (OrderStatus $state) => $state->label())
                            ->color(fn (OrderStatus $state) => $state->color()),
                        TextEntry::make('created_at')
                            ->dateTime(),
                        TextEntry::make('updated_at')
                            ->dateTime(),
                    ]),

                Section::make('Client')
                    ->columns(4)
                    ->schema([
                        TextEntry::make('client.first_name')
                            ->label('First name'),
                        TextEntry::make('client.last_name')
                            ->label('Last name'),
                        TextEntry::make('client.phone_number')
                            ->label('Phone'),
                        TextEntry::make('client.wilaya.name')
                            ->label('Wilaya'),
                        TextEntry::make('client.commune.name')
                            ->label('Commune'),
                    ]),

                Section::make('Items')
                    ->schema([
                        RepeatableEntry::make('items')
                            ->hiddenLabel()
                            ->columns(4)
                            ->schema([
                                TextEntry::make('product_name')
                                    ->label('Product'),
                                TextEntry::make('quantity'),
                                TextEntry::make('price')
                                    ->label('Unit price')
                                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                                    ->suffix(' DZ'),
                                TextEntry::make('total_price')
                                    ->label('Total')
                                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                                    ->suffix(' DZ'),
                            ]),
                    ]),

                Section::make('Totals')
                    ->columns(3)
                    ->schema([
                        TextEntry::make('subtotal')
                            ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                            ->suffix(' DZ'),
                        TextEntry::make('delivery_price')
                            ->label('Delivery')
                            ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                            ->suffix(' DZ'),
                        TextEntry::make('total_price')
                            ->label('Total')
                            ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                            ->suffix(' DZ'),
                    ]),

                Section::make('Status history')
                    ->schema([
                        RepeatableEntry::make('statusHistories')
                            ->hiddenLabel()
                            ->columns(3)
                            ->schema([
                                TextEntry::make('status')
                                    ->badge()
                                    ->formatStateUsing(fn (OrderStatus $state) => $state->label())
                                    ->color(fn (OrderStatus $state) => $state->color()),
                                TextEntry::make('user.name')
                                    ->label('By')
                                    ->placeholder('System'),
                                TextEntry::make('created_at')
                                    ->dateTime(),
                            ]),
                    ]),

                Section::make('Notes')
                    ->schema([
                        RepeatableEntry::make('notes')
                            ->hiddenLabel()
                            ->columns(3)
                            ->schema([
                                TextEntry::make('content')
                                    ->columnSpan(2),
                                TextEntry::make('user.name')
                                    ->label('By')
                                    ->placeholder('Customer'),
                                TextEntry::make('created_at')
                                    ->dateTime(),
                            ]),
                    ])
                    ->visible(fn ($record) => $record->notes->isNotEmpty()),
            ]);
    }
}
