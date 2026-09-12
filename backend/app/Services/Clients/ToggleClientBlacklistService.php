<?php

namespace App\Services\Clients;

use App\Models\Client;

class ToggleClientBlacklistService
{
    public function execute(Client $client): Client
    {
        $client->update([
            'is_blacklisted' => ! $client->is_blacklisted,
            'blacklisted_at' => $client->is_blacklisted ? null : now(),
        ]);

        return $client;
    }
}
