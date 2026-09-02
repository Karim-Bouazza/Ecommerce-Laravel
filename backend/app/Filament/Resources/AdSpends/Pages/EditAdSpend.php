<?php

namespace App\Filament\Resources\AdSpends\Pages;

use App\Filament\Resources\AdSpends\AdSpendResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAdSpend extends EditRecord
{
    protected static string $resource = AdSpendResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
