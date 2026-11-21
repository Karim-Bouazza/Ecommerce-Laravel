<?php

namespace App\Data\Storefront;

use App\Enums\Storefront\StorefrontProductSection;
use App\Models\Storefront\StorefrontSectionProduct;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;
use Spatie\LaravelData\Data;

class StoreStorefrontSectionProductData extends Data
{
    public function __construct(
        public int $product_id,
        public ?string $label = null,
    ) {}

    public static function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
                Rule::unique('storefront_section_products', 'product_id')
                    ->where('section', self::section()->value),
            ],
            'label' => ['nullable', 'string', 'max:60'],
        ];
    }

    public static function messages(): array
    {
        return [
            'product_id.unique' => 'Ce produit fait déjà partie de cette section.',
        ];
    }

    public static function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $section = self::section();

            if (StorefrontSectionProduct::inSection($section)->count() >= $section->maxItems()) {
                $validator->errors()->add(
                    'product_id',
                    sprintf('Cette section accepte au maximum %d produits.', $section->maxItems())
                );
            }
        });
    }

    private static function section(): StorefrontProductSection
    {
        return request()->route('section');
    }
}
