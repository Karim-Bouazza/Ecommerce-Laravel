<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BrandController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('brands.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $brands = Brand::query()
            ->withCount('products')
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return BrandResource::collection($brands);
    }

    public function options()
    {
        return Brand::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function store(StoreBrandRequest $request): BrandResource
    {
        $brand = Brand::create($request->validated());

        return new BrandResource($brand->loadCount('products'));
    }

    public function update(UpdateBrandRequest $request, Brand $brand): BrandResource
    {
        $brand->update($request->validated());

        return new BrandResource($brand->fresh()->loadCount('products'));
    }

    public function toggleActive(Brand $brand): BrandResource
    {
        abort_unless(auth()->user()->hasPermission('brands.edit'), 403);

        $brand->update(['is_active' => ! $brand->is_active]);

        return new BrandResource($brand->fresh()->loadCount('products'));
    }

    public function destroy(Brand $brand): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('brands.delete'), 403);

        $brand->delete();

        return response()->json(['message' => 'Marque supprimée.']);
    }
}
