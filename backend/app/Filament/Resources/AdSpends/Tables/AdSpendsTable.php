<?php

namespace App\Filament\Resources\AdSpends\Tables;

use App\Models\Product;
use App\Models\ProductAdSpend;
use App\Support\ProductProfit;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class AdSpendsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('product.name')
                    ->label('Produit')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('date')
                    ->label('Date')
                    ->date()
                    ->sortable(),
                TextColumn::make('amount_usd')
                    ->label('Dépense')
                    ->numeric(decimalPlaces: 2)
                    ->prefix('$')
                    ->sortable(),
                TextColumn::make('amount_dzd')
                    ->label('Coût (DZ)')
                    ->state(fn (ProductAdSpend $record) => $record->amountDzd())
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ'),
                TextColumn::make('revenue_profit')
                    ->label('Bénéfice brut (livré)')
                    ->state(fn (ProductAdSpend $record) => ProductProfit::deliveredProfitFor($record->product, $record->date))
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ'),
                TextColumn::make('net_profit')
                    ->label('Bénéfice net')
                    ->state(function (ProductAdSpend $record) {
                        $revenueProfit = ProductProfit::deliveredProfitFor($record->product, $record->date);

                        return $revenueProfit - $record->amountDzd();
                    })
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->color(fn ($state) => $state >= 0 ? 'success' : 'danger'),
            ])
            ->defaultSort('date', 'desc')
            ->filters([
                SelectFilter::make('product_id')
                    ->label('Produit')
                    ->options(Product::pluck('name', 'id'))
                    ->searchable(),
                Filter::make('date')
                    ->schema([
                        DatePicker::make('from')
                            ->label('De'),
                        DatePicker::make('until')
                            ->label('À'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('date', '>=', $date))
                            ->when($data['until'] ?? null, fn (Builder $query, string $date) => $query->whereDate('date', '<=', $date));
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
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
