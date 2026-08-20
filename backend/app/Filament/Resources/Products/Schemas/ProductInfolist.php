<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('category.name')
                    ->label('Category')
                    ->placeholder('-'),
                TextEntry::make('name'),
                TextEntry::make('description')
                    ->html()
                    ->prose()
                    ->columnSpanFull(),
                TextEntry::make('price')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ'),
                TextEntry::make('purchase_price')
                    ->label('Prix d\'achat')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->placeholder('-'),
                TextEntry::make('compare_price')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZ')
                    ->placeholder('-'),
                TextEntry::make('stock')
                    ->numeric(),
                ImageEntry::make('image_1'),
                ImageEntry::make('image_2')
                    ->placeholder('-'),
                ImageEntry::make('image_3')
                    ->placeholder('-'),
                ImageEntry::make('image_4')
                    ->placeholder('-'),
                IconEntry::make('is_active')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
