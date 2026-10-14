<?php

namespace App\Services\Fournisseurs;

use App\Models\Purchasing\Fournisseur;

class DeleteFournisseurService
{
    public function execute(Fournisseur $fournisseur): void
    {
        $fournisseur->delete();
    }
}
