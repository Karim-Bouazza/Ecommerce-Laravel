<?php

namespace App\Http\Controllers\Api\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Marketing\StorePixelRequest;
use App\Http\Requests\Marketing\UpdatePixelRequest;
use App\Http\Resources\Marketing\PixelResource;
use App\Models\Marketing\Pixel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PixelController extends Controller
{
    public function active(): JsonResponse
    {
        $pixels = Pixel::query()
            ->where('is_active', true)
            ->where('provider', 'facebook')
            ->get(['provider', 'pixel_id'])
            ->map(fn (Pixel $pixel) => [
                'provider' => $pixel->provider,
                'pixel_id' => $pixel->pixel_id,
            ]);

        return response()->json($pixels);
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('pixels.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $pixels = Pixel::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('pixel_id', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return PixelResource::collection($pixels);
    }

    public function store(StorePixelRequest $request): PixelResource
    {
        $pixel = Pixel::create($request->validated());

        return new PixelResource($pixel);
    }

    public function update(UpdatePixelRequest $request, Pixel $pixel): PixelResource
    {
        $pixel->update($request->validated());

        return new PixelResource($pixel->fresh());
    }

    public function toggleActive(Pixel $pixel): PixelResource
    {
        abort_unless(auth()->user()->hasPermission('pixels.edit'), 403);

        $pixel->update(['is_active' => ! $pixel->is_active]);

        return new PixelResource($pixel->fresh());
    }

    public function destroy(Pixel $pixel): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('pixels.delete'), 403);

        $pixel->delete();

        return response()->json(['message' => 'Pixel supprimé.']);
    }
}
