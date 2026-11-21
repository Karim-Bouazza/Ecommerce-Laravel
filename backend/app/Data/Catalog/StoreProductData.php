<?php

namespace App\Data\Catalog;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class StoreProductData extends Data
{
    public function __construct(
        public string $name,
        public string $description,
        public int $price,
        public UploadedFile $image_1,
        public ?string $sku = null,
        public ?string $short_description = null,
        public ?int $category_id = null,
        public ?int $purchase_price = null,
        public ?int $compare_price = null,
        public bool $is_active = true,
        public bool $is_new = false,
        public ?UploadedFile $image_2 = null,
        public ?UploadedFile $image_3 = null,
        public ?UploadedFile $image_4 = null,
        #[DataCollectionOf(ProductSpecInputData::class)]
        public array $specs = [],
        public array $variants = [],
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'description' => ['required', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'purchase_price' => ['nullable', 'integer', 'min:0'],
            'price' => ['required', 'integer', 'min:0'],
            'compare_price' => ['nullable', 'integer', 'min:0', 'gt:price'],
            'is_active' => ['boolean'],
            'is_new' => ['boolean'],
            'image_1' => ['required', 'image', 'max:4096'],
            'image_2' => ['nullable', 'image', 'max:4096'],
            'image_3' => ['nullable', 'image', 'max:4096'],
            'image_4' => ['nullable', 'image', 'max:4096'],
            'specs' => ['array'],
            'specs.*.label' => ['required_with:specs', 'string', 'max:255'],
            'specs.*.value' => ['required_with:specs', 'string', 'max:255'],
            'variants' => ['array'],
            'variants.*' => ['required', 'string', 'max:255'],
        ];
    }
}
