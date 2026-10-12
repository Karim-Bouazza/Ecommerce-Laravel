<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderStorefrontItemsRequest;
use App\Http\Requests\StorefrontFeatureRequest;
use App\Http\Resources\StorefrontFeatureResource;
use App\Models\StorefrontFeature;
use App\Services\Storefront\ReorderStorefrontItemsService;
use Illuminate\Support\Facades\Storage;

class StorefrontFeatureController extends Controller
{
    public function index()
    {
        return StorefrontFeatureResource::collection(
            StorefrontFeature::query()->orderBy('position')->orderBy('id')->get()
        );
    }

    public function store(StorefrontFeatureRequest $request)
    {
        $feature = StorefrontFeature::create([
            ...$request->safe()->only(['title', 'description']),
            'image_path' => $request->file('image')->store('storefront/features', 'public'),
            'position' => (int) StorefrontFeature::max('position') + 1,
        ]);

        return new StorefrontFeatureResource($feature);
    }

    public function update(StorefrontFeatureRequest $request, StorefrontFeature $feature)
    {
        $data = $request->safe()->only(['title', 'description']);
        $previousPath = $feature->image_path;

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('storefront/features', 'public');
        }

        $feature->update($data);

        if ($request->hasFile('image') && $previousPath) {
            Storage::disk('public')->delete($previousPath);
        }

        return new StorefrontFeatureResource($feature);
    }

    public function reorder(ReorderStorefrontItemsRequest $request, ReorderStorefrontItemsService $reorder)
    {
        $reorder->execute(StorefrontFeature::query(), $request->ids());

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
