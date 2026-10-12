<?php

namespace App\Http\Requests;

use App\Enums\StorefrontProductSection;
use App\Models\StorefrontSectionProduct;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreStorefrontSectionProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
                Rule::unique('storefront_section_products', 'product_id')
                    ->where('section', $this->section()->value),
            ],
            'label' => ['nullable', 'string', 'max:60'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_id.unique' => 'Ce produit fait déjà partie de cette section.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $section = $this->section();

            if (StorefrontSectionProduct::inSection($section)->count() >= $section->maxItems()) {
                $validator->errors()->add(
                    'product_id',
                    sprintf('Cette section accepte au maximum %d produits.', $section->maxItems())
                );
            }
        });
    }

    public function section(): StorefrontProductSection
    {
        return $this->route('section');
    }
}
