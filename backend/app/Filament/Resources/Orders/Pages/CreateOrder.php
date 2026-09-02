<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Enums\OrderType;
use App\Filament\Resources\Orders\OrderResource;
use App\Filament\Resources\Orders\Schemas\ManualOrderForm;
use App\Services\Orders\CreateOrderService;
use Filament\Resources\Pages\CreateRecord;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Model;

class CreateOrder extends CreateRecord
{
    protected static string $resource = OrderResource::class;

    public function form(Schema $schema): Schema
    {
        return ManualOrderForm::configure($schema);
    }

    protected function handleRecordCreation(array $data): Model
    {
        $data['type'] = OrderType::Manuelle;

        return app(CreateOrderService::class)->execute($data);
    }
}
