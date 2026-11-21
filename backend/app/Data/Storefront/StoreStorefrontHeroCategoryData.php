<?php

namespace App\Data\Storefront;

use App\Models\Storefront\StorefrontHeroCategory;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;
use Spatie\LaravelData\Data;

class StoreStorefrontHeroCategoryData extends Data
{
    public function __construct(
        public int $category_id,
        public UploadedFile $image,
    ) {}

    public static function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id', 'unique:storefront_hero_categories,category_id'],
            'image' => ['required', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ];
    }

    public static function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (StorefrontHeroCategory::count() >= StorefrontHeroCategory::MAX_ITEMS) {
                $validator->errors()->add(
                    'category_id',
                    sprintf('Vous ne pouvez pas mettre en avant plus de %d catégories.', StorefrontHeroCategory::MAX_ITEMS)
                );
            }
        });
    }
}
