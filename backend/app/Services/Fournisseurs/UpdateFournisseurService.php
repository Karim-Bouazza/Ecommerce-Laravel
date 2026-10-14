<?php

namespace App\Services\Fournisseurs;

use App\Models\Purchasing\Fournisseur;
use Illuminate\Support\Arr;

class UpdateFournisseurService
{
    public function execute(Fournisseur $fournisseur, array $data): Fournisseur
    {
        $fournisseur->update(Arr::only($data, [
            'name',
            'phone',
            'remark',
            'address',
        ]));

        return $fournisseur;
    }
}
