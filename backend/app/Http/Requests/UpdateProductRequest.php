<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('products.edit');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku,' . $productId],
            'description' => ['required', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'purchase_price' => ['nullable', 'integer', 'min:0'],
            'price' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'is_new' => ['boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
            'tags' => ['array'],
            'tags.*' => ['integer', 'exists:tags,id'],
            'specs' => ['array'],
            'specs.*.label' => ['required_with:specs', 'string', 'max:255'],
            'specs.*.value' => ['required_with:specs', 'string', 'max:255'],
            'variants' => ['array'],
            'variants.*' => ['required', 'string', 'max:255'],
        ];
    }
}
