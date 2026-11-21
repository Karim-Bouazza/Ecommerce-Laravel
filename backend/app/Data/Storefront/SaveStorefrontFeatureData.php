<?php

namespace App\Data\Storefront;

use App\Models\Storefront\StorefrontFeature;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class SaveStorefrontFeatureData extends Data
{
    public function __construct(
        public string $title,
        public string|null|Optional $description = new Optional(),
        public ?UploadedFile $image = null,
    ) {}

    public static function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:200'],
            'image' => [self::isCreating() ? 'required' : 'nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ];
    }

    public static function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (self::isCreating() && StorefrontFeature::count() >= StorefrontFeature::MAX_ITEMS) {
                $validator->errors()->add(
                    'title',
                    sprintf('La section « Nos Atouts » accepte au maximum %d cartes.', StorefrontFeature::MAX_ITEMS)
                );
            }
        });
    }

    private static function isCreating(): bool
    {
        return request()->route('feature') === null;
    }
}
