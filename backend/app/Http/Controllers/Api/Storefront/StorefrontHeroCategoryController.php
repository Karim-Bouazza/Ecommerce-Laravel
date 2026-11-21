<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\StorefrontHeroCategoryData;
use App\Data\Storefront\StoreStorefrontHeroCategoryData;
use App\Data\Storefront\UpdateStorefrontHeroCategoryData;
use App\Http\Controllers\Controller;
use App\Models\Storefront\StorefrontHeroCategory;
use Illuminate\Support\Facades\Storage;
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
            'image_path' => $data->image->store('hero-categories', 'public'),
            'position' => $position,
        ]);

        return StorefrontHeroCategoryData::fromHeroCategory(
            $heroCategory->load(['category' => fn ($query) => $query->withCount('products')])
        );
    }

    public function update(UpdateStorefrontHeroCategoryData $data, StorefrontHeroCategory $heroCategory): StorefrontHeroCategoryData
    {
        $attributes = $data->only('category_id', 'position')->toArray();
        $previousPath = $heroCategory->getRawOriginal('image_path');

        if ($data->image !== null) {
            $attributes['image_path'] = $data->image->store('hero-categories', 'public');
        }

        $heroCategory->update($attributes);

        if ($data->image !== null && $previousPath) {
            Storage::disk('public')->delete($previousPath);
        }

        return StorefrontHeroCategoryData::fromHeroCategory(
            $heroCategory->fresh()->load(['category' => fn ($query) => $query->withCount('products')])
        );
    }

    public function destroy(StorefrontHeroCategory $heroCategory)
    {
        $path = $heroCategory->getRawOriginal('image_path');
        $heroCategory->delete();

        if ($path) {
            Storage::disk('public')->delete($path);
        }

        return response()->noContent();
    }
}
