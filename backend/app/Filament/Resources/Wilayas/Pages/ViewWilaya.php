<?php

namespace App\Filament\Resources\Wilayas\Pages;

use App\Filament\Resources\Wilayas\WilayaResource;
use Filament\Resources\Pages\ViewRecord;

class ViewWilaya extends ViewRecord
{
    protected static string $resource = WilayaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            //
        ];
    }
}
