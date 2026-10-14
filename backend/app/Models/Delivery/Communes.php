<?php

namespace App\Models\Delivery;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Communes extends Model
{
    protected $fillable = [
        'wilaya_id',
        'name',
        'ar_name',
        'provider_id',
    ];

    public function Wilaya(): BelongsTo
    {
        return $this->belongsTo(Wilaya::class, 'wilaya_id');
    }
}
