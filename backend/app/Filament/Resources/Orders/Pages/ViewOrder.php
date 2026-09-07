<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\Actions\OrderDeleteAction;
use App\Filament\Resources\Orders\Actions\OrderPaymentActions;
use App\Filament\Resources\Orders\Actions\OrderStatusActions;
use App\Filament\Resources\Orders\OrderResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Filament\Support\Icons\Heroicon;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make()
                ->icon(Heroicon::OutlinedPencilSquare)
                ->iconButton()
                ->tooltip('Modifier'),
            OrderStatusActions::changeStatus()
                ->iconButton()
                ->tooltip('Changer le statut'),
            OrderStatusActions::changeStatusWithNote()
                ->iconButton()
                ->tooltip('Changer le statut + note'),
            OrderPaymentActions::markAsPaid()
                ->iconButton()
                ->tooltip('Marquer comme payée'),
            OrderDeleteAction::make()
                ->iconButton()
                ->tooltip('Supprimer'),
        ];
    }
}
