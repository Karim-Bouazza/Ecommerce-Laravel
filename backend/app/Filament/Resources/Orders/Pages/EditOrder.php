<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\OrderNote;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

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

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $this->newNote = trim((string) ($data['new_note'] ?? '')) ?: null;

        unset($data['new_note']);

        return $data;
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
