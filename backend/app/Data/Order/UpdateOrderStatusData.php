<?php

namespace App\Data\Order;

use App\Enums\Order\OrderStatus;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateOrderStatusData extends Data
{
    public function __construct(
        public string $status,
        public ?string $date_report = null,
    ) {}

    public static function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(array_column(OrderStatus::cases(), 'value'))],
            'date_report' => ['required_if:status,' . OrderStatus::Reported->value, 'nullable', 'date'],
        ];
    }
}
