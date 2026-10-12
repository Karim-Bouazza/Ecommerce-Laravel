<?php

namespace App\Http\Controllers\Api;

use App\Enums\StorefrontProductSection;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderStorefrontItemsRequest;
use App\Http\Requests\StoreStorefrontSectionProductRequest;
use App\Http\Requests\UpdateStorefrontSectionProductRequest;
use App\Http\Resources\StorefrontSectionProductResource;
use App\Models\StorefrontSectionProduct;
use App\Services\Storefront\ReorderStorefrontItemsService;
use Illuminate\Database\Eloquent\Builder;

class StorefrontSectionProductController extends Controller
{
    /**
     * Public: products shown in a homepage section (active products only).
     */
    public function index(StorefrontProductSection $section)
    {
        return StorefrontSectionProductResource::collection(
            $this->query($section)
                ->whereHas('product', fn (Builder $query) => $query->where('is_active', true))
                ->get()
        );
    }

    /**
     * Admin: every product picked for the section, including inactive ones.
     */
    public function manage(StorefrontProductSection $section)
    {
        return StorefrontSectionProductResource::collection($this->query($section)->get());
    }

    public function store(StoreStorefrontSectionProductRequest $request, StorefrontProductSection $section)
    {
        $item = StorefrontSectionProduct::create([
            'section' => $section,
            'product_id' => $request->validated('product_id'),
            'label' => $request->validated('label'),
            'position' => (int) StorefrontSectionProduct::inSection($section)->max('position') + 1,
        ]);

        return new StorefrontSectionProductResource($item->load('product.specs'));
    }

    public function update(UpdateStorefrontSectionProductRequest $request, StorefrontProductSection $section, StorefrontSectionProduct $item)
    {
        abort_unless($item->section === $section, 404);

        $item->update(['label' => $request->validated('label')]);

        return new StorefrontSectionProductResource($item->load('product.specs'));
    }

    public function reorder(ReorderStorefrontItemsRequest $request, StorefrontProductSection $section, ReorderStorefrontItemsService $reorder)
    {
        $reorder->execute(StorefrontSectionProduct::inSection($section), $request->ids());

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
            ->with('product.specs')
            ->orderBy('position')
            ->orderBy('id');
    }
}
