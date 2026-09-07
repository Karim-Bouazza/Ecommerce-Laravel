<?php

namespace App\Models;

use App\Enums\WalletTransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    protected $fillable = [
        'name',
        'remark',
    ];

    protected $casts = [
        'balance' => 'integer',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function entriesTotal(): int
    {
        return $this->transactions()->where('type', WalletTransactionType::In)->sum('amount');
    }

    public function exitsTotal(): int
    {
        return $this->transactions()->where('type', WalletTransactionType::Out)->sum('amount');
    }
}
