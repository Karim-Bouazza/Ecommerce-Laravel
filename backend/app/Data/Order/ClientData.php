<?php

namespace App\Data\Order;

use App\Models\Order\Client;
use Spatie\LaravelData\Data;

class ClientData extends Data
{
    public function __construct(
        public int $id,
        public ?string $first_name,
        public ?string $last_name,
        public string $full_name,
        public ?string $phone_number,
        public ?int $wilaya_id,
        public ?string $wilaya,
        public ?int $commune_id,
        public ?string $commune,
        public bool $is_blacklisted,
    ) {}

    public static function fromClient(Client $client): self
    {
        return new self(
            id: $client->id,
            first_name: $client->first_name,
            last_name: $client->last_name,
            full_name: trim("{$client->first_name} {$client->last_name}"),
            phone_number: $client->phone_number,
            wilaya_id: $client->wilaya_id,
            wilaya: $client->wilaya?->name,
            commune_id: $client->commune_id,
            commune: $client->commune?->name,
            is_blacklisted: (bool) $client->is_blacklisted,
        );
    }
}
