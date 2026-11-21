<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\ReorderStorefrontItemsData;
use App\Data\Storefront\SaveStorefrontPromoBannerData;
use App\Data\Storefront\StorefrontPromoBannerData;
use App\Http\Controllers\Controller;
use App\Models\Storefront\StorefrontPromoBanner;
use App\Services\Storefront\ReorderStorefrontItemsService;
use Illuminate\Support\Facades\Storage;
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
            'image_path' => $data->image->store('storefront/promo-banners', 'public'),
            'position' => (int) StorefrontPromoBanner::max('position') + 1,
        ]);

        return StorefrontPromoBannerData::fromBanner($banner);
    }

    public function update(SaveStorefrontPromoBannerData $data, StorefrontPromoBanner $banner): StorefrontPromoBannerData
    {
        $attributes = $data->fields();
        $previousPath = $banner->image_path;

        if ($data->image !== null) {
            $attributes['image_path'] = $data->image->store('storefront/promo-banners', 'public');
        }

        $banner->update($attributes);

        if ($data->image !== null && $previousPath) {
            Storage::disk('public')->delete($previousPath);
        }

        return StorefrontPromoBannerData::fromBanner($banner);
    }

    public function reorder(ReorderStorefrontItemsData $data, ReorderStorefrontItemsService $reorder): DataCollection
    {
        $reorder->execute(StorefrontPromoBanner::query(), $data->orderedIds());

        return $this->index();
    }

    public function destroy(StorefrontPromoBanner $banner)
    {
        $path = $banner->image_path;
        $banner->delete();

        Storage::disk('public')->delete($path);

        return response()->noContent();
    }
}
