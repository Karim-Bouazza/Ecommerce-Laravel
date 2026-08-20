<?php

namespace App\Filament\Resources\Wilayas\Tables;

use App\Models\Wilaya;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;
use Filament\Support\RawJs;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class WilayasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('price_domicile')
                    ->label('Home delivery')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->sortable(),
                TextColumn::make('price_stop_desk')
                    ->label('Stop desk')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->sortable(),
                TextColumn::make('communes_count')
                    ->label('Cities')
                    ->counts('communes')
                    ->sortable(),
            ])
            ->defaultSort('code')
            ->recordActions([
                ViewAction::make(),
                Action::make('editPrices')
                    ->label('Edit prices')
                    ->icon(Heroicon::OutlinedBanknotes)
                    ->fillForm(fn (Wilaya $record) => $record->only(['price_domicile', 'price_stop_desk']))
                    ->schema([
                        TextInput::make('price_domicile')
                            ->label('Home delivery price')
                            ->numeric()
                            ->mask(RawJs::make("\$money(\$input, ' ', '.', 0)"))
                            ->stripCharacters(' ')
                            ->dehydrateStateUsing(fn (?string $state) => filled($state) ? str_replace(' ', '', $state) : $state)
                            ->minValue(0)
                            ->required()
                            ->suffix('DZ'),
                        TextInput::make('price_stop_desk')
                            ->label('Stop desk price')
                            ->numeric()
                            ->mask(RawJs::make("\$money(\$input, ' ', '.', 0)"))
                            ->stripCharacters(' ')
                            ->dehydrateStateUsing(fn (?string $state) => filled($state) ? str_replace(' ', '', $state) : $state)
                            ->minValue(0)
                            ->required()
                            ->suffix('DZ'),
                    ])
                    ->action(fn (Wilaya $record, array $data) => $record->update($data)),
            ]);
    }
}
