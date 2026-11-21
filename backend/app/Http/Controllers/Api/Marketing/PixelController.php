<?php

namespace App\Http\Controllers\Api\Marketing;

use App\Data\Marketing\PixelData;
use App\Data\Marketing\SavePixelData;
use App\Http\Controllers\Controller;
use App\Models\Marketing\Pixel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

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

    public function index(Request $request): PaginatedDataCollection
    {
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

        $pixels->through(fn (Pixel $pixel) => PixelData::fromPixel($pixel));

        return PixelData::collect($pixels, PaginatedDataCollection::class);
    }

    public function store(SavePixelData $data): PixelData
    {
        $pixel = Pixel::create($data->toArray());

        return PixelData::fromPixel($pixel);
    }

    public function update(SavePixelData $data, Pixel $pixel): PixelData
    {
        $pixel->update($data->toArray());

        return PixelData::fromPixel($pixel->fresh());
    }

    public function toggleActive(Pixel $pixel): PixelData
    {
        $pixel->update(['is_active' => ! $pixel->is_active]);

        return PixelData::fromPixel($pixel->fresh());
    }

    public function destroy(Pixel $pixel): JsonResponse
    {
        $pixel->delete();

        return response()->json(['message' => 'Pixel supprimé.']);
    }
}
