<?php

namespace App\Data\Purchasing;

use App\Models\Purchasing\Fournisseur;
use Spatie\LaravelData\Data;

class FournisseurRefData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}

    public static function fromFournisseur(Fournisseur $fournisseur): self
    {
        return new self($fournisseur->id, $fournisseur->name);
    }
}
