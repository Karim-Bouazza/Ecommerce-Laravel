<?php

namespace App\Filament\Resources\AdSpends\Schemas;

use App\Models\Product;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Validation\Rules\Unique;

class AdSpendForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Select::make('product_id')
                    ->label('Produit')
                    ->options(Product::where('is_active', true)->pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->live()
                    ->required(),
                DatePicker::make('date')
                    ->label('Date')
                    ->default(now())
                    ->required()
                    ->unique(
                        modifyRuleUsing: fn (Unique $rule, Get $get) => $rule->where('product_id', $get('product_id')),
                        ignoreRecord: true,
                    )
                    ->validationMessages([
                        'unique' => 'Une dépense existe déjà pour ce produit à cette date, modifiez-la plutôt.',
                    ]),
                TextInput::make('amount_usd')
                    ->label('Montant dépensé')
                    ->numeric()
                    ->minValue(0)
                    ->required()
                    ->prefix('$'),
            ]);
    }
}
