<?php

namespace App\Http\Controllers\Api\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Marketing\StorePixelExcludedIpRequest;
use App\Http\Resources\Marketing\PixelExcludedIpResource;
use App\Models\Marketing\PixelExcludedIp;
use App\Services\PixelTracking\ExcludedIpMatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PixelExcludedIpController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('pixels.view'), 403);

        return PixelExcludedIpResource::collection(
            PixelExcludedIp::query()->orderByDesc('id')->get()
        );
    }

    public function store(StorePixelExcludedIpRequest $request): JsonResponse
    {
        $data = $request->validated();

        $entry = PixelExcludedIp::create([
            'pattern' => ExcludedIpMatcher::normalize($data['pattern']),
            'note' => filled($data['note'] ?? null) ? trim($data['note']) : null,
        ]);

        return (new PixelExcludedIpResource($entry))->response()->setStatusCode(201);
    }

    public function destroy(PixelExcludedIp $pixelExcludedIp): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('pixels.delete'), 403);

        $pixelExcludedIp->delete();

        return response()->json(['message' => 'Adresse retirée de la liste.']);
    }
}
