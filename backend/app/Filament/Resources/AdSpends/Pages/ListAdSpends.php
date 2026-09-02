<?php

namespace App\Filament\Resources\AdSpends\Pages;

use App\Filament\Resources\AdSpends\AdSpendResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAdSpends extends ListRecords
{
    protected static string $resource = AdSpendResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Nouvelle dépense'),
        ];
    }
}
