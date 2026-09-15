<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryCompanyIntegration extends Model
{
    protected $fillable = [
        'company_key',
        'name',
        'base_url',
        'api_token',
    ];

    protected $casts = [
        'api_token' => 'encrypted',
    ];
}
