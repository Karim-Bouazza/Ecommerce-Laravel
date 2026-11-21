<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\ReorderStorefrontItemsData;
use App\Data\Storefront\SaveStorefrontPromoBannerData;
use App\Data\Storefront\StorefrontPromoBannerData;
use App\Http\Controllers\Controller;
use App\Models\Storefront\StorefrontPromoBanner;
use App\Services\Storefront\ReorderStorefrontItemsService;
use Spatie\LaravelData\DataCollection;

class StorefrontPromoBannerController extends Controller
{
    public function index(): DataCollection
    {
        return StorefrontPromoBannerData::collect(
            StorefrontPromoBanner::query()->orderBy('position')->orderBy('id')->get(),
            DataCollection::class
        );
    }

    public function store(SaveStorefrontPromoBannerData $data): StorefrontPromoBannerData
    {
        $banner = StorefrontPromoBanner::create([
            ...$data->fields(),
            'position' => (int) StorefrontPromoBanner::max('position') + 1,
        ]);

        $banner->setImage($data->image);

        return StorefrontPromoBannerData::fromBanner($banner);
    }

    public function update(SaveStorefrontPromoBannerData $data, StorefrontPromoBanner $banner): StorefrontPromoBannerData
    {
        $banner->update($data->fields());
        $banner->setImage($data->image);

        return StorefrontPromoBannerData::fromBanner($banner);
    }

    public function reorder(ReorderStorefrontItemsData $data, ReorderStorefrontItemsService $reorder): DataCollection
    {
        $reorder->execute(StorefrontPromoBanner::query(), $data->orderedIds());

        return $this->index();
    }

    public function destroy(StorefrontPromoBanner $banner)
    {
        $banner->delete();

        return response()->noContent();
    }
}
