<?php

namespace App\Data\Catalog;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateProductData extends Data
{
    public function __construct(
        public string $name,
        public string $description,
        public int $price,
        public string|null|Optional $sku = new Optional(),
        public string|null|Optional $short_description = new Optional(),
        public int|null|Optional $category_id = new Optional(),
        public int|null|Optional $purchase_price = new Optional(),
        public int|null|Optional $compare_price = new Optional(),
        public bool|Optional $is_active = new Optional(),
        public bool|Optional $is_new = new Optional(),
        public ?UploadedFile $image_1 = null,
        public ?UploadedFile $image_2 = null,
        public ?UploadedFile $image_3 = null,
        public ?UploadedFile $image_4 = null,
        public array $remove_images = [],
        #[DataCollectionOf(ProductSpecInputData::class)]
        public array|Optional $specs = new Optional(),
        public array|Optional $variants = new Optional(),
    ) {}

    public static function rules(): array
    {
        $productId = request()->route('product')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku,' . $productId],
            'description' => ['required', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'purchase_price' => ['nullable', 'integer', 'min:0'],
            'price' => ['required', 'integer', 'min:0'],
            'compare_price' => ['nullable', 'integer', 'min:0', 'gt:price'],
            'is_active' => ['boolean'],
            'is_new' => ['boolean'],
            'image_1' => ['nullable', 'image', 'max:4096'],
            'image_2' => ['nullable', 'image', 'max:4096'],
            'image_3' => ['nullable', 'image', 'max:4096'],
            'image_4' => ['nullable', 'image', 'max:4096'],
            'remove_images' => ['array'],
            'remove_images.*' => ['integer', 'in:2,3,4'],
            'specs' => ['array'],
            'specs.*.label' => ['required_with:specs', 'string', 'max:255'],
            'specs.*.value' => ['required_with:specs', 'string', 'max:255'],
            'variants' => ['array'],
            'variants.*' => ['required', 'string', 'max:255'],
        ];
    }
}
