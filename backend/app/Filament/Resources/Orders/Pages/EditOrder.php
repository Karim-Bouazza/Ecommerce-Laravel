<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\OrderItem;
use App\Models\OrderNote;
use App\Services\Orders\UpdateOrderService;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    private ?string $newNote = null;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $client = $this->record->client;

        $data['first_name'] = $client->first_name;
        $data['last_name'] = $client->last_name;
        $data['phone_number'] = $client->phone_number;
        $data['wilaya_id'] = $client->wilaya_id;
        $data['commune_id'] = $client->commune_id;

        $data['items'] = $this->record->items->map(fn (OrderItem $item) => [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'unit_price' => $item->price,
            'variant' => $item->variant,
            'has_variant' => filled($item->variant),
        ])->all();

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $this->newNote = trim((string) ($data['new_note'] ?? '')) ?: null;

        unset($data['new_note']);

        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        return app(UpdateOrderService::class)->execute($record, $data);
    }

    protected function afterSave(): void
    {
        if ($this->newNote !== null) {
            OrderNote::create([
                'order_id' => $this->record->id,
                'user_id' => auth()->id(),
                'content' => $this->newNote,
            ]);
        }
    }
}
