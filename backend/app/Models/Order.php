<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'wilaya_id',
        'commune_id',
        'total_price',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class);
    }

    public function commune()
    {
        return $this->belongsTo(Communes::class);
    }
}
