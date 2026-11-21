<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\StorefrontHeroCategoryData;
use App\Data\Storefront\StoreStorefrontHeroCategoryData;
use App\Data\Storefront\UpdateStorefrontHeroCategoryData;
use App\Http\Controllers\Controller;
use App\Models\Storefront\StorefrontHeroCategory;
use Spatie\LaravelData\DataCollection;

class StorefrontHeroCategoryController extends Controller
{
    public function index(): DataCollection
    {
        $heroCategories = StorefrontHeroCategory::query()
            ->orderBy('position')
            ->with(['category' => fn ($query) => $query->withCount('products')])
            ->get();

        return StorefrontHeroCategoryData::collect($heroCategories, DataCollection::class);
    }

    public function store(StoreStorefrontHeroCategoryData $data): StorefrontHeroCategoryData
    {
        $position = (int) StorefrontHeroCategory::max('position') + 1;

        $heroCategory = StorefrontHeroCategory::create([
            'category_id' => $data->category_id,
            'position' => $position,
        ]);

        $heroCategory->setImage($data->image);

        return StorefrontHeroCategoryData::fromHeroCategory(
            $heroCategory->load(['category' => fn ($query) => $query->withCount('products')])
        );
    }

    public function update(UpdateStorefrontHeroCategoryData $data, StorefrontHeroCategory $heroCategory): StorefrontHeroCategoryData
    {
        $heroCategory->update($data->only('category_id', 'position')->toArray());
        $heroCategory->setImage($data->image);

        return StorefrontHeroCategoryData::fromHeroCategory(
            $heroCategory->fresh()->load(['category' => fn ($query) => $query->withCount('products')])
        );
    }

    public function destroy(StorefrontHeroCategory $heroCategory)
    {
        $heroCategory->delete();

        return response()->noContent();
    }
}
