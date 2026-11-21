<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\ReorderStorefrontItemsData;
use App\Data\Storefront\SaveStorefrontFeatureData;
use App\Data\Storefront\StorefrontFeatureData;
use App\Http\Controllers\Controller;
use App\Models\Storefront\StorefrontFeature;
use App\Services\Storefront\ReorderStorefrontItemsService;
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
            'position' => (int) StorefrontFeature::max('position') + 1,
        ]);

        $feature->setImage($data->image);

        return StorefrontFeatureData::fromFeature($feature);
    }

    public function update(SaveStorefrontFeatureData $data, StorefrontFeature $feature): StorefrontFeatureData
    {
        $feature->update($data->only('title', 'description')->toArray());
        $feature->setImage($data->image);

        return StorefrontFeatureData::fromFeature($feature);
    }

    public function reorder(ReorderStorefrontItemsData $data, ReorderStorefrontItemsService $reorder): DataCollection
    {
        $reorder->execute(StorefrontFeature::query(), $data->orderedIds());

        return $this->index();
    }

    public function destroy(StorefrontFeature $feature)
    {
        $feature->delete();

        return response()->noContent();
    }
}
