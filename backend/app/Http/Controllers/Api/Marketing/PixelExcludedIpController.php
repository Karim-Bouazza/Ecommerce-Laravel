<?php

namespace App\Http\Controllers\Api\Marketing;

use App\Data\Marketing\PixelExcludedIpData;
use App\Data\Marketing\StorePixelExcludedIpData;
use App\Http\Controllers\Controller;
use App\Models\Marketing\PixelExcludedIp;
use App\Services\PixelTracking\ExcludedIpMatcher;
use Illuminate\Http\JsonResponse;
use Spatie\LaravelData\DataCollection;

class PixelExcludedIpController extends Controller
{
    public function index(): DataCollection
    {
        return PixelExcludedIpData::collect(
            PixelExcludedIp::query()->orderByDesc('id')->get(),
            DataCollection::class
        );
    }

    public function store(StorePixelExcludedIpData $data): JsonResponse
    {
        $entry = PixelExcludedIp::create([
            'pattern' => ExcludedIpMatcher::normalize($data->pattern),
            'note' => filled($data->note) ? trim($data->note) : null,
        ]);

        return PixelExcludedIpData::fromEntry($entry)->toResponse(request())->setStatusCode(201);
    }

    public function destroy(PixelExcludedIp $pixelExcludedIp): JsonResponse
    {
        $pixelExcludedIp->delete();

        return response()->json(['message' => 'Adresse retirée de la liste.']);
    }
}
