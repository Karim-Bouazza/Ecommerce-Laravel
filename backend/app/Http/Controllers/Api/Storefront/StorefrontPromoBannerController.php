<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\ReorderStorefrontItemsRequest;
use App\Http\Requests\Storefront\StorefrontPromoBannerRequest;
use App\Http\Resources\Storefront\StorefrontPromoBannerResource;
use App\Models\Storefront\StorefrontPromoBanner;
use App\Services\Storefront\ReorderStorefrontItemsService;
use Illuminate\Support\Facades\Storage;

class StorefrontPromoBannerController extends Controller
{
    private const FIELDS = ['eyebrow', 'title', 'description', 'button_label', 'link_url', 'highlight'];

    public function index()
    {
        return StorefrontPromoBannerResource::collection(
            StorefrontPromoBanner::query()->orderBy('position')->orderBy('id')->get()
        );
    }

    public function store(StorefrontPromoBannerRequest $request)
    {
        $banner = StorefrontPromoBanner::create([
            ...$request->safe()->only(self::FIELDS),
            'image_path' => $request->file('image')->store('storefront/promo-banners', 'public'),
            'position' => (int) StorefrontPromoBanner::max('position') + 1,
        ]);

        return new StorefrontPromoBannerResource($banner);
    }

    public function update(StorefrontPromoBannerRequest $request, StorefrontPromoBanner $banner)
    {
        $data = $request->safe()->only(self::FIELDS);
        $previousPath = $banner->image_path;

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('storefront/promo-banners', 'public');
        }

        $banner->update($data);

        if ($request->hasFile('image') && $previousPath) {
            Storage::disk('public')->delete($previousPath);
        }

        return new StorefrontPromoBannerResource($banner);
    }

    public function reorder(ReorderStorefrontItemsRequest $request, ReorderStorefrontItemsService $reorder)
    {
        $reorder->execute(StorefrontPromoBanner::query(), $request->ids());

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
