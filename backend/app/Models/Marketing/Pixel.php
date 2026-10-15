<?php

namespace App\Models\Marketing;

use Illuminate\Database\Eloquent\Model;

class Pixel extends Model
{
    public const PROVIDERS = ['facebook'];

    protected $fillable = [
        'name',
        'provider',
        'pixel_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
