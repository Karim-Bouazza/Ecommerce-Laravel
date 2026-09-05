<?php

namespace App\Filament\Resources\DeliveryCompanies\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DeliveryCompanyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->unique(ignoreRecord: true),
            ]);
    }
}
