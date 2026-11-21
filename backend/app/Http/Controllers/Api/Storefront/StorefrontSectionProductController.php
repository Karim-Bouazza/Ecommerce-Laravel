<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\ReorderStorefrontItemsData;
use App\Data\Storefront\StorefrontSectionProductData;
use App\Data\Storefront\StoreStorefrontSectionProductData;
use App\Data\Storefront\UpdateStorefrontSectionProductData;
use App\Enums\Storefront\StorefrontProductSection;
use App\Http\Controllers\Controller;
use App\Models\Storefront\StorefrontSectionProduct;
use App\Services\Storefront\ReorderStorefrontItemsService;
use Illuminate\Database\Eloquent\Builder;
use Spatie\LaravelData\DataCollection;

class StorefrontSectionProductController extends Controller
{
    public function index(StorefrontProductSection $section): DataCollection
    {
        return StorefrontSectionProductData::collect(
            $this->query($section)
                ->whereHas('product', fn (Builder $query) => $query->where('is_active', true))
                ->get(),
            DataCollection::class
        );
    }

    public function manage(StorefrontProductSection $section): DataCollection
    {
        return StorefrontSectionProductData::collect($this->query($section)->get(), DataCollection::class);
    }

    public function store(StoreStorefrontSectionProductData $data, StorefrontProductSection $section): StorefrontSectionProductData
    {
        $item = StorefrontSectionProduct::create([
            'section' => $section,
            'product_id' => $data->product_id,
            'label' => $data->label,
            'position' => (int) StorefrontSectionProduct::inSection($section)->max('position') + 1,
        ]);

        return StorefrontSectionProductData::fromItem($item->load('product.specs'));
    }

    public function update(UpdateStorefrontSectionProductData $data, StorefrontProductSection $section, StorefrontSectionProduct $item): StorefrontSectionProductData
    {
        abort_unless($item->section === $section, 404);

        $item->update(['label' => $data->label]);

        return StorefrontSectionProductData::fromItem($item->load('product.specs'));
    }

    public function reorder(ReorderStorefrontItemsData $data, StorefrontProductSection $section, ReorderStorefrontItemsService $reorder): DataCollection
    {
        $reorder->execute(StorefrontSectionProduct::inSection($section), $data->orderedIds());

        return $this->manage($section);
    }

    public function destroy(StorefrontProductSection $section, StorefrontSectionProduct $item)
    {
        abort_unless($item->section === $section, 404);

        $item->delete();

        return response()->noContent();
    }

    private function query(StorefrontProductSection $section): Builder
    {
        return StorefrontSectionProduct::inSection($section)
            ->with(['product.specs', 'product.media'])
            ->orderBy('position')
            ->orderBy('id');
    }
}
