<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\StorefrontCategoryData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Category;
use Spatie\LaravelData\DataCollection;

class StorefrontCategoryController extends Controller
{
    public function index(): DataCollection
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->having('products_count', '>', 0)
            ->orderBy('name')
            ->get();

        return StorefrontCategoryData::collect($categories, DataCollection::class);
    }
}
