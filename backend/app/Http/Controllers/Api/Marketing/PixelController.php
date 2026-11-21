<?php

namespace App\Http\Controllers\Api\Marketing;

use App\Data\Marketing\PixelData;
use App\Data\Marketing\SavePixelData;
use App\Http\Controllers\Controller;
use App\Models\Marketing\Pixel;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

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
        $pixels = QueryBuilder::for(
            Pixel::query(),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(AllowedFilter::custom('search', new SearchFilter(['name', 'pixel_id'])))
            ->allowedSorts('name', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
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
