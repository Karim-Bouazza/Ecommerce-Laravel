<?php

namespace App\Data\Purchasing;

use App\Models\Purchasing\Fournisseur;
use Spatie\LaravelData\Data;

class FournisseurData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $phone,
        public ?string $remark,
        public ?string $address,
        public mixed $total_dues,
        public mixed $total_paid,
        public mixed $remaining_amount,
    ) {}

    public static function fromFournisseur(Fournisseur $fournisseur): self
    {
        return new self(
            id: $fournisseur->id,
            name: $fournisseur->name,
            phone: $fournisseur->phone,
            remark: $fournisseur->remark,
            address: $fournisseur->address,
            total_dues: $fournisseur->totalDues(),
            total_paid: $fournisseur->totalPaid(),
            remaining_amount: $fournisseur->remainingAmount(),
        );
    }
}
