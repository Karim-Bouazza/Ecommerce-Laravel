<?php

namespace App\Http\Controllers\Api\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\UpdateWilayaRequest;
use App\Http\Resources\Delivery\WilayaResource;
use App\Models\Delivery\Wilaya;

class WilayaController extends Controller
{
    public function index()
    {
        $wilayas = Wilaya::query()
            ->orderBy('code')
            ->get();

        return WilayaResource::collection($wilayas);
    }

    public function update(UpdateWilayaRequest $request, Wilaya $wilaya): WilayaResource
    {
        $wilaya->update($request->validated());

        return new WilayaResource($wilaya->fresh());
    }
}
