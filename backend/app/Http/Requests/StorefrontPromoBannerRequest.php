<?php

namespace App\Http\Requests;

use App\Models\StorefrontPromoBanner;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Create (POST) or update (PUT) a promo banner. The image is required on create only.
 */
class StorefrontPromoBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'highlight' => $this->boolean('highlight'),
            'button_label' => $this->filled('button_label') ? $this->input('button_label') : 'Acheter',
        ]);
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:60'],
            'title' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:200'],
            'button_label' => ['required', 'string', 'max:30'],
            // Internal path (/products?category_id=3) or full URL.
            'link_url' => ['nullable', 'string', 'max:255', 'regex:/^(\/|https?:\/\/)/'],
            'highlight' => ['boolean'],
            'image' => [$this->isCreating() ? 'required' : 'nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'link_url.regex' => 'Le lien doit commencer par « / » (page du site) ou par « http(s):// ».',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->isCreating() && StorefrontPromoBanner::count() >= StorefrontPromoBanner::MAX_ITEMS) {
                $validator->errors()->add(
                    'title',
                    sprintf('Vous ne pouvez pas créer plus de %d bannières.', StorefrontPromoBanner::MAX_ITEMS)
                );
            }
        });
    }

    private function isCreating(): bool
    {
        return $this->route('banner') === null;
    }
}
