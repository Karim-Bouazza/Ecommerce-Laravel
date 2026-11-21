<?php

namespace App\Data\Delivery;

use Spatie\LaravelData\Data;

class SaveDeliveryCompanyIntegrationData extends Data
{
    public function __construct(
        public string $name,
        public string $api_token,
    ) {}

    public static function authorize(): bool
    {
        return request()->user() !== null;
    }

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'api_token' => ['required', 'string', 'max:1000'],
        ];
    }
}
