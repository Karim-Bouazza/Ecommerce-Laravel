<?php

namespace App\Services\Fournisseurs;

use App\Models\Fournisseur;

class CreateFournisseurService
{
    public function execute(array $data): Fournisseur
    {
        return Fournisseur::create([
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'remark' => $data['remark'] ?? null,
            'address' => $data['address'] ?? null,
        ]);
    }
}
