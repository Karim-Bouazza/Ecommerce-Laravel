<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

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
                TextInput::make('description')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('stock')
                    ->required()
                    ->numeric(),
                FileUpload::make('image_1')
                    ->image()
                    ->directory('products')
                    ->required(),
                FileUpload::make('image_2')
                    ->image()
                    ->directory('products'),
                FileUpload::make('image_3')
                    ->image()
                    ->directory('products'),
                FileUpload::make('image_4')
                    ->image()
                    ->directory('products'),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
