<?php

namespace App\Services\Fournisseurs;

use App\Data\Purchasing\UpdateFournisseurData;
use App\Models\Purchasing\Fournisseur;
use Illuminate\Support\Arr;

class UpdateFournisseurService
{
    public function execute(Fournisseur $fournisseur, UpdateFournisseurData $input): Fournisseur
    {
        $data = $input->toArray();

        $fournisseur->update(Arr::only($data, [
            'name',
            'phone',
            'remark',
            'address',
        ]));

        return $fournisseur;
    }
}
