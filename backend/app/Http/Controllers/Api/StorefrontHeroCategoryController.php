<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStorefrontHeroCategoryRequest;
use App\Http\Requests\UpdateStorefrontHeroCategoryRequest;
use App\Http\Resources\StorefrontHeroCategoryResource;
use App\Models\StorefrontHeroCategory;
use Illuminate\Support\Facades\Storage;

class StorefrontHeroCategoryController extends Controller
{
    public function index()
    {
        $heroCategories = StorefrontHeroCategory::query()
            ->orderBy('position')
            ->with(['category' => fn ($query) => $query->withCount('products')])
            ->get();

        return StorefrontHeroCategoryResource::collection($heroCategories);
    }

    public function store(StoreStorefrontHeroCategoryRequest $request)
    {
        $position = (int) StorefrontHeroCategory::max('position') + 1;

        $heroCategory = StorefrontHeroCategory::create([
            'category_id' => $request->validated('category_id'),
            'image_path' => $request->file('image')->store('hero-categories', 'public'),
            'position' => $position,
        ]);

        return new StorefrontHeroCategoryResource(
            $heroCategory->load(['category' => fn ($query) => $query->withCount('products')])
        );
    }

    public function update(UpdateStorefrontHeroCategoryRequest $request, StorefrontHeroCategory $heroCategory)
    {
        $data = $request->safe()->only(['category_id', 'position']);
        $previousPath = $heroCategory->getRawOriginal('image_path');

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('hero-categories', 'public');
        }

        $heroCategory->update($data);

        if ($request->hasFile('image') && $previousPath) {
            Storage::disk('public')->delete($previousPath);
        }

        return new StorefrontHeroCategoryResource(
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
