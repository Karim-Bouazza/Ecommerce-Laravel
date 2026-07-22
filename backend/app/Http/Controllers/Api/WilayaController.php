<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WilayaDetailResource;
use App\Http\Resources\WilayaResource;
use App\Models\Wilaya;
use Illuminate\Http\Request;

class WilayaController extends Controller
{
    public function index()
    {
        $wilayas = Wilaya::query()
            ->orderBy('code')
            ->get();

        return WilayaResource::collection($wilayas);
    }

    public function show(Wilaya $wilaya)
    {
        $wilaya->load('communes');

        return new WilayaDetailResource($wilaya);
    }
}
