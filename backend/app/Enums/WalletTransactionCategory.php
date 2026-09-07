<?php

namespace App\Enums;

enum WalletTransactionCategory: string
{
    case Deposit = 'deposit';
    case Withdrawal = 'withdrawal';
    case Versement = 'versement';
    case Payment = 'payment';

    public function label(): string
    {
        return match ($this) {
            self::Deposit => 'Dépôt',
            self::Withdrawal => 'Retrait',
            self::Versement => 'Versement',
            self::Payment => 'Paiement',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Deposit => 'success',
            self::Withdrawal => 'danger',
            self::Versement => 'info',
            self::Payment => 'warning',
        };
    }
}
