<?php

namespace App\Services\Fournisseurs;

use App\Data\Purchasing\SaveFournisseurData;
use App\Models\Purchasing\Fournisseur;
use Illuminate\Support\Arr;

class UpdateFournisseurService
{
    public function execute(Fournisseur $fournisseur, SaveFournisseurData $input): Fournisseur
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
