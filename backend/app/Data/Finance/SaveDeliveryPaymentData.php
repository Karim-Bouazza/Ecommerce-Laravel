<?php

namespace App\Data\Finance;

use Spatie\LaravelData\Data;

class SaveDeliveryPaymentData extends Data
{
    public function __construct(
        public string $date,
        public int $wallet_id,
        public int $delivery_company_integration_id,
        public int|float $amount,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'wallet_id' => ['required', 'integer', 'exists:wallets,id'],
            'delivery_company_integration_id' => ['required', 'integer', 'exists:delivery_company_integrations,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'remark' => ['nullable', 'string', 'max:255'],
        ];
    }
}
