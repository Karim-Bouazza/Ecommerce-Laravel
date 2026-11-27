<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Data\Catalog\CategoryData;
use App\Data\Catalog\SaveCategoryData;
use App\Data\Catalog\UpdateCategoryData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Category;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CategoryController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $categories = QueryBuilder::for(
            Category::query()->withCount('products'),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(AllowedFilter::custom('search', new SearchFilter(['name'])))
            ->allowedSorts('name', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
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

    public function update(UpdateCategoryData $data, Category $category): CategoryData
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
