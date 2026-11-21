<?php

namespace App\Data\Marketing;

use App\Models\Marketing\Pixel;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class SavePixelData extends Data
{
    public function __construct(
        public string $name,
        public string $provider,
        public string $pixel_id,
        public bool|Optional $is_active = new Optional(),
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        if (isset($properties['pixel_id']) && is_string($properties['pixel_id'])) {
            $properties['pixel_id'] = trim($properties['pixel_id']);
        }

        return $properties;
    }

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'provider' => ['required', 'string', Rule::in(Pixel::PROVIDERS)],
            'pixel_id' => ['required', 'string', 'regex:/^\d{10,20}$/'],
            'is_active' => ['boolean'],
        ];
    }

    public static function messages(): array
    {
        return [
            'pixel_id.regex' => "L'ID du pixel Meta doit contenir uniquement des chiffres (10 à 20).",
        ];
    }
}
