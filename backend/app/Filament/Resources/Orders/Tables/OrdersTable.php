<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentStatus;
use App\Filament\Resources\Orders\Actions\OrderDeleteAction;
use App\Filament\Resources\Orders\Actions\OrderPaymentActions;
use App\Filament\Resources\Orders\Actions\OrderStatusActions;
use App\Filament\Resources\Orders\OrderResource;
use App\Models\Client;
use App\Models\Order;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Hidden;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

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
                TextColumn::make('scheduled_at')
                    ->label('Planifiée pour')
                    ->date()
                    ->placeholder('—')
                    ->toggleable()
                    ->sortable(),
                TextColumn::make('payment_status')
                    ->label('Paiement')
                    ->badge()
                    ->formatStateUsing(fn (PaymentStatus $state) => $state->label())
                    ->color(fn (PaymentStatus $state) => $state->color()),
                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (OrderType $state) => $state->label())
                    ->color(fn (OrderType $state) => $state->color()),
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
                Filter::make('client_id')
                    ->schema([
                        Hidden::make('value'),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query->forClient($data['value'] ?? null))
                    ->indicateUsing(function (array $data): array {
                        $client = filled($data['value'] ?? null)
                            ? Client::find($data['value'])
                            : null;

                        return $client
                            ? ["Client : {$client->first_name} {$client->last_name}"]
                            : [];
                    }),
                SelectFilter::make('status')
                    ->options(OrderStatus::options()),
                SelectFilter::make('payment_status')
                    ->label('Paiement')
                    ->options(PaymentStatus::options()),
                SelectFilter::make('type')
                    ->options(OrderType::options()),
                Filter::make('created_at')
                    ->schema([
                        DatePicker::make('from')
                            ->label('De'),
                        DatePicker::make('until')
                            ->label('À'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('created_at', '>=', $date))
                            ->when($data['until'] ?? null, fn (Builder $query, string $date) => $query->whereDate('created_at', '<=', $date));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];

                        if ($data['from'] ?? null) {
                            $indicators[] = 'À partir du '.Carbon::parse($data['from'])->format('d/m/Y');
                        }

                        if ($data['until'] ?? null) {
                            $indicators[] = "Jusqu'au ".Carbon::parse($data['until'])->format('d/m/Y');
                        }

                        return $indicators;
                    }),
            ])
            ->recordActions([
                ViewAction::make()
                    ->url(fn (Order $record) => OrderResource::getUrl('view', ['record' => $record]))
                    ->iconButton()
                    ->tooltip('Voir'),
                OrderStatusActions::changeStatus()
                    ->iconButton()
                    ->tooltip('Changer le statut'),
                OrderStatusActions::changeStatusWithNote()
                    ->iconButton()
                    ->tooltip('Changer le statut + note'),
                OrderPaymentActions::markAsPaid()
                    ->iconButton()
                    ->tooltip('Marquer comme payée'),
                OrderDeleteAction::make()
                    ->iconButton()
                    ->tooltip('Supprimer'),
            ]);
    }
}
