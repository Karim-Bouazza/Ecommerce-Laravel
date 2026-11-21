<?php

namespace App\Services\Fournisseurs;

use App\Data\Purchasing\SaveFournisseurData;
use App\Models\Purchasing\Fournisseur;

class CreateFournisseurService
{
    public function execute(SaveFournisseurData $input): Fournisseur
    {
        $data = $input->toArray();

        return Fournisseur::create([
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'remark' => $data['remark'] ?? null,
            'address' => $data['address'] ?? null,
        ]);
    }
}
