<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\StorefrontCategoryResource;
use App\Models\Catalog\Category;

class StorefrontCategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->having('products_count', '>', 0)
            ->orderBy('name')
            ->get();

        return StorefrontCategoryResource::collection($categories);
    }
}
