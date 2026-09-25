<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StorefrontCategoryResource;
use App\Models\Category;

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
