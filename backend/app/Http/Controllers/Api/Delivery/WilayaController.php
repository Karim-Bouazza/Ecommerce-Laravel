<?php

namespace App\Http\Controllers\Api\Delivery;

use App\Data\Delivery\UpdateWilayaPricesData;
use App\Data\Delivery\WilayaData;
use App\Http\Controllers\Controller;
use App\Models\Delivery\Wilaya;
use Spatie\LaravelData\DataCollection;

class WilayaController extends Controller
{
    public function index(): DataCollection
    {
        $wilayas = Wilaya::query()
            ->orderBy('code')
            ->get();

        return WilayaData::collect($wilayas, DataCollection::class);
    }

    public function update(UpdateWilayaPricesData $data, Wilaya $wilaya): WilayaData
    {
        $wilaya->update($data->toArray());

        return WilayaData::fromWilaya($wilaya->fresh());
    }
}
