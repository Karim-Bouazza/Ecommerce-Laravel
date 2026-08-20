<?php

namespace App\Filament\Resources\Orders\Actions;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderNote;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\DB;

class OrderStatusActions
{
    public static function changeStatus(): Action
    {
        return Action::make('changeStatus')
            ->label('Changer le statut')
            ->icon(Heroicon::OutlinedArrowPath)
            ->color('gray')
            ->visible(fn (Order $record) => filled($record->status->allowedTransitions()))
            ->schema(fn (Order $record) => [
                Select::make('status')
                    ->label('Nouveau statut')
                    ->options(self::transitionOptions($record))
                    ->required(),
            ])
            ->action(function (Order $record, array $data): void {
                self::applyStatusChange($record, OrderStatus::from($data['status']));

                Notification::make()
                    ->title('Statut mis à jour')
                    ->success()
                    ->send();
            });
    }

    public static function changeStatusWithNote(): Action
    {
        return Action::make('changeStatusWithNote')
            ->label('Changer le statut + note')
            ->icon(Heroicon::OutlinedChatBubbleLeftRight)
            ->color('gray')
            ->visible(fn (Order $record) => filled($record->status->allowedTransitions()))
            ->schema(fn (Order $record) => [
                Select::make('status')
                    ->label('Nouveau statut')
                    ->options(self::transitionOptions($record))
                    ->required(),
                Textarea::make('note')
                    ->label('Note')
                    ->required()
                    ->columnSpanFull(),
            ])
            ->action(function (Order $record, array $data): void {
                self::applyStatusChange($record, OrderStatus::from($data['status']), $data['note']);

                Notification::make()
                    ->title('Statut mis à jour')
                    ->success()
                    ->send();
            });
    }

    /**
     * @return array<string, string>
     */
    private static function transitionOptions(Order $record): array
    {
        return collect($record->status->allowedTransitions())
            ->mapWithKeys(fn (OrderStatus $status) => [$status->value => $status->label()])
            ->all();
    }

    private static function applyStatusChange(Order $record, OrderStatus $status, ?string $note = null): void
    {
        DB::transaction(function () use ($record, $status, $note): void {
            $record->update(['status' => $status]);

            if ($status === OrderStatus::Delivered) {
                self::decrementStock($record);
            }

            OrderStatusHistory::create([
                'order_id' => $record->id,
                'status' => $status,
                'user_id' => auth()->id(),
            ]);

            if (filled($note)) {
                OrderNote::create([
                    'order_id' => $record->id,
                    'user_id' => auth()->id(),
                    'content' => $note,
                ]);
            }
        });
    }

    private static function decrementStock(Order $record): void
    {
        foreach ($record->items as $item) {
            Product::whereKey($item->product_id)->decrement('stock', $item->quantity);
        }
    }
}
