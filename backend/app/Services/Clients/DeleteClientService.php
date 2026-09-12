<?php

namespace App\Services\Clients;

use App\Models\Client;
use RuntimeException;

class DeleteClientService
{
    public function execute(Client $client): void
    {
        if ($client->orders()->exists()) {
            throw new RuntimeException('Ce client a des commandes et ne peut pas être supprimé.');
        }

        $client->delete();
    }
}
