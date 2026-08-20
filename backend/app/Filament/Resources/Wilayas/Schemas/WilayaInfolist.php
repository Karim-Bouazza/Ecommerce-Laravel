<?php

namespace App\Filament\Resources\Wilayas\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class WilayaInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Wilaya')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('code'),
                        TextEntry::make('name'),
                    ]),

                Section::make('Delivery prices')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('price_domicile')
                            ->label('Home delivery')
                            ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                            ->suffix(' DZ'),
                        TextEntry::make('price_stop_desk')
                            ->label('Stop desk')
                            ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                            ->suffix(' DZ'),
                    ]),
            ]);
    }
}
