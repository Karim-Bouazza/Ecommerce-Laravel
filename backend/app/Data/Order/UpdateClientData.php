<?php

namespace App\Data\Order;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class UpdateClientData extends Data
{
    public function __construct(
        public string $first_name,
        public string $last_name,
        public string $phone_number,
        public int $wilaya_id,
        public int $commune_id,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('clients', 'phone_number')->ignore(request()->route('client')),
            ],
            'wilaya_id' => ['required', 'integer', 'exists:wilayas,id'],
            'commune_id' => [
                'required',
                'integer',
                Rule::exists('communes', 'id')->where('wilaya_id', $context->payload['wilaya_id'] ?? null),
            ],
        ];
    }
}
