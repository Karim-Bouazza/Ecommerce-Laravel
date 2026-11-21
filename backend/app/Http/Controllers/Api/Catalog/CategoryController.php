<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Data\Catalog\CategoryData;
use App\Data\Catalog\SaveCategoryData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class CategoryController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $categories = Category::query()
            ->withCount('products')
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $categories->through(fn (Category $category) => CategoryData::fromCategory($category));

        return CategoryData::collect($categories, PaginatedDataCollection::class);
    }

    public function options()
    {
        return Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function store(SaveCategoryData $data): CategoryData
    {
        $category = Category::create($data->toArray());

        return CategoryData::fromCategory($category->loadCount('products'));
    }

    public function update(SaveCategoryData $data, Category $category): CategoryData
    {
        $category->update($data->toArray());

        return CategoryData::fromCategory($category->fresh()->loadCount('products'));
    }

    public function toggleActive(Category $category): CategoryData
    {
        $category->update(['is_active' => ! $category->is_active]);

        return CategoryData::fromCategory($category->fresh()->loadCount('products'));
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée.']);
    }
}
