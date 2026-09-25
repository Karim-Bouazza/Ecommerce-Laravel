<?php

namespace App\Http\Requests;

use App\Models\StorefrontHeroCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreStorefrontHeroCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id', 'unique:storefront_hero_categories,category_id'],
            'image' => ['required', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ];
    }

    public function withValidator(Validator $validator): void
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
