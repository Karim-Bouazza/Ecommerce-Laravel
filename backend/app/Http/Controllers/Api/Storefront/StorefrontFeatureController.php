<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\ReorderStorefrontItemsData;
use App\Data\Storefront\SaveStorefrontFeatureData;
use App\Data\Storefront\StorefrontFeatureData;
use App\Http\Controllers\Controller;
use App\Models\Storefront\StorefrontFeature;
use App\Services\Storefront\ReorderStorefrontItemsService;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelData\DataCollection;

class StorefrontFeatureController extends Controller
{
    public function index(): DataCollection
    {
        return StorefrontFeatureData::collect(
            StorefrontFeature::query()->orderBy('position')->orderBy('id')->get(),
            DataCollection::class
        );
    }

    public function store(SaveStorefrontFeatureData $data): StorefrontFeatureData
    {
        $feature = StorefrontFeature::create([
            ...$data->only('title', 'description')->toArray(),
            'image_path' => $data->image->store('storefront/features', 'public'),
            'position' => (int) StorefrontFeature::max('position') + 1,
        ]);

        return StorefrontFeatureData::fromFeature($feature);
    }

    public function update(SaveStorefrontFeatureData $data, StorefrontFeature $feature): StorefrontFeatureData
    {
        $attributes = $data->only('title', 'description')->toArray();
        $previousPath = $feature->image_path;

        if ($data->image !== null) {
            $attributes['image_path'] = $data->image->store('storefront/features', 'public');
        }

        $feature->update($attributes);

        if ($data->image !== null && $previousPath) {
            Storage::disk('public')->delete($previousPath);
        }

        return StorefrontFeatureData::fromFeature($feature);
    }

    public function reorder(ReorderStorefrontItemsData $data, ReorderStorefrontItemsService $reorder): DataCollection
    {
        $reorder->execute(StorefrontFeature::query(), $data->orderedIds());

        return $this->index();
    }

    public function destroy(StorefrontFeature $feature)
    {
        $path = $feature->image_path;
        $feature->delete();

        Storage::disk('public')->delete($path);

        return response()->noContent();
    }
}
