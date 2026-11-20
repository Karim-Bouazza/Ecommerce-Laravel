<?php

namespace App\Http\Requests\Order;

use App\Enums\Order\OrderStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(array_column(OrderStatus::cases(), 'value'))],
            'date_report' => ['required_if:status,'.OrderStatus::Reported->value, 'nullable', 'date'],
        ];
    }
}
