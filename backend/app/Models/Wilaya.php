<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wilaya extends Model
{
    protected $fillable = [
        'code',
        'name',
    ];

    public function communes(): HasMany
    {
        return $this->hasMany(Communes::class);
    }
}
