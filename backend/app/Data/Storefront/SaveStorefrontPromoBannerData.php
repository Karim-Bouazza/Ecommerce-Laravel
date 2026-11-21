<?php

namespace App\Data\Storefront;

use App\Models\Storefront\StorefrontPromoBanner;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class SaveStorefrontPromoBannerData extends Data
{
    public function __construct(
        public string $title,
        public string $button_label,
        public bool $highlight = false,
        public string|null|Optional $eyebrow = new Optional(),
        public string|null|Optional $description = new Optional(),
        public string|null|Optional $link_url = new Optional(),
        public ?UploadedFile $image = null,
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        $properties['highlight'] = filter_var($properties['highlight'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $buttonLabel = $properties['button_label'] ?? null;
        $properties['button_label'] = filled($buttonLabel) ? $buttonLabel : 'Acheter';

        return $properties;
    }

    public static function rules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:60'],
            'title' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:200'],
            'button_label' => ['required', 'string', 'max:30'],
            'link_url' => ['nullable', 'string', 'max:255', 'regex:/^(\/|https?:\/\/)/'],
            'highlight' => ['boolean'],
            'image' => [self::isCreating() ? 'required' : 'nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ];
    }

    public static function messages(): array
    {
        return [
            'link_url.regex' => 'Le lien doit commencer par « / » (page du site) ou par « http(s):// ».',
        ];
    }

    public static function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (self::isCreating() && StorefrontPromoBanner::count() >= StorefrontPromoBanner::MAX_ITEMS) {
                $validator->errors()->add(
                    'title',
                    sprintf('Vous ne pouvez pas créer plus de %d bannières.', StorefrontPromoBanner::MAX_ITEMS)
                );
            }
        });
    }

    private static function isCreating(): bool
    {
        return request()->route('banner') === null;
    }

    public function fields(): array
    {
        return $this->only('eyebrow', 'title', 'description', 'button_label', 'link_url', 'highlight')->toArray();
    }
}
