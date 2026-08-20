<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Enums\OrderStatus;
use App\Filament\Resources\Orders\Actions\OrderStatusActions;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('client.first_name')
                    ->label('Client')
                    ->formatStateUsing(fn ($record) => trim($record->client->first_name.' '.$record->client->last_name))
                    ->searchable(['first_name', 'last_name']),
                TextColumn::make('client.phone_number')
                    ->label('Phone')
                    ->searchable(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (OrderStatus $state) => $state->label())
                    ->color(fn (OrderStatus $state) => $state->color()),
                TextColumn::make('subtotal')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->sortable(),
                TextColumn::make('delivery_price')
                    ->label('Delivery')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->sortable(),
                TextColumn::make('total_price')
                    ->label('Total')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options(OrderStatus::options()),
            ])
            ->recordActions([
                ViewAction::make(),
                OrderStatusActions::changeStatus(),
                OrderStatusActions::changeStatusWithNote(),
            ]);
    }
}
