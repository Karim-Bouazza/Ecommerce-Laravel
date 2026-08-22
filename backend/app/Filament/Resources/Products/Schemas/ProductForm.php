<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Support\RawJs;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable(),
                TextInput::make('name')
                    ->required(),
                RichEditor::make('description')
                    ->required()
                    ->columnSpanFull()
                    ->extraAttributes(['class' => 'fi-description-editor']),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->mask(RawJs::make("\$money(\$input, ' ', ',', 0)"))
                    ->stripCharacters([' ', '.', ','])
                    ->dehydrateStateUsing(fn (?string $state) => filled($state) ? (int) str_replace([' ', '.', ','], '', $state) : $state)
                    ->suffix('DZ'),
                TextInput::make('purchase_price')
                    ->label('Prix d\'achat')
                    ->helperText('Visible uniquement dans l\'administration, jamais affiché aux clients.')
                    ->numeric()
                    ->mask(RawJs::make("\$money(\$input, ' ', ',', 0)"))
                    ->stripCharacters([' ', '.', ','])
                    ->dehydrateStateUsing(fn (?string $state) => filled($state) ? (int) str_replace([' ', '.', ','], '', $state) : $state)
                    ->suffix('DZ'),
                TextInput::make('compare_price')
                    ->numeric()
                    ->mask(RawJs::make("\$money(\$input, ' ', ',', 0)"))
                    ->stripCharacters([' ', '.', ','])
                    ->dehydrateStateUsing(fn (?string $state) => filled($state) ? (int) str_replace([' ', '.', ','], '', $state) : $state)
                    ->suffix('DZ'),
                TextInput::make('stock')
                    ->required()
                    ->numeric(),
                FileUpload::make('image_1')
                    ->image()
                    ->disk('public')
                    ->visibility('public')
                    ->directory('products')
                    ->required(),
                FileUpload::make('image_2')
                    ->image()
                    ->disk('public')
                    ->visibility('public')
                    ->directory('products'),
                FileUpload::make('image_3')
                    ->image()
                    ->disk('public')
                    ->visibility('public')
                    ->directory('products'),
                FileUpload::make('image_4')
                    ->image()
                    ->disk('public')
                    ->visibility('public')
                    ->directory('products'),
                Toggle::make('is_active')
                    ->required()
                    ->default(true),
            ]);
    }
}
