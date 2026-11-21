<?php

namespace App\Data\Order;

use App\Models\Order\OrderStatusHistory;
use Spatie\LaravelData\Data;

class OrderStatusHistoryData extends Data
{
    public function __construct(
        public int $id,
        public string $status,
        public string $status_label,
        public string $status_color,
        public ?string $previous_status,
        public ?string $previous_status_label,
        public ?string $previous_status_color,
        public ?string $user_name,
        public ?string $created_at,
    ) {}

    public static function fromHistory(OrderStatusHistory $history): self
    {
        return new self(
            id: $history->id,
            status: $history->status->value,
            status_label: $history->status->label(),
            status_color: $history->status->color(),
            previous_status: $history->previous_status?->value,
            previous_status_label: $history->previous_status?->label(),
            previous_status_color: $history->previous_status?->color(),
            user_name: $history->user?->name,
            created_at: $history->created_at?->toIso8601String(),
        );
    }
}
