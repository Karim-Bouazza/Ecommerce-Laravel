<?php

namespace App\Services\Clients;

use App\Data\Order\UpdateClientData;
use App\Models\Order\Client;

class UpdateClientService
{
    public function execute(Client $client, UpdateClientData $data): Client
    {
        $client->update([
            'first_name' => $data->first_name,
            'last_name' => $data->last_name,
            'phone_number' => $data->phone_number,
            'wilaya_id' => $data->wilaya_id,
            'commune_id' => $data->commune_id,
        ]);

        return $client;
    }
}
