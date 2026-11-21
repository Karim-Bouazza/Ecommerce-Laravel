<?php

namespace App\Data\Storefront;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateStorefrontHeroCategoryData extends Data
{
    public function __construct(
        public int|Optional $category_id = new Optional(),
        public int|Optional $position = new Optional(),
        public ?UploadedFile $image = null,
    ) {}

    public static function rules(): array
    {
        return [
            'category_id' => [
                'sometimes',
                'integer',
                'exists:categories,id',
                Rule::unique('storefront_hero_categories', 'category_id')->ignore(request()->route('heroCategory')),
            ],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
