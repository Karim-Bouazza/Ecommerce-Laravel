<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('new_note')
                    ->label('Add a note')
                    ->dehydrated(false)
                    ->columnSpanFull(),
            ]);
    }
}
