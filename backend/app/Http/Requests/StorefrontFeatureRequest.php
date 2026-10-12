<?php

namespace App\Http\Requests;

use App\Models\StorefrontFeature;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Create (POST) or update (PUT) a "Nos Atouts" card. The image is required on create only.
 */
class StorefrontFeatureRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:200'],
            'image' => [$this->isCreating() ? 'required' : 'nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->isCreating() && StorefrontFeature::count() >= StorefrontFeature::MAX_ITEMS) {
                $validator->errors()->add(
                    'title',
                    sprintf('La section « Nos Atouts » accepte au maximum %d cartes.', StorefrontFeature::MAX_ITEMS)
                );
            }
        });
    }

    private function isCreating(): bool
    {
        return $this->route('feature') === null;
    }
}
