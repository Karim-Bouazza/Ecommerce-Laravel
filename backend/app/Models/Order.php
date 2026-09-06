<?php

namespace App\Models;

use App\Enums\DeliveryType;
use App\Enums\OrderStatus;
use App\Enums\OrderType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'client_id',
        'reference',
        'status',
        'type',
        'subtotal',
        'delivery_price',
        'delivery_type',
        'stop_desk_company_id',
        'total_price',
        'created_at',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'type' => OrderType::class,
        'delivery_type' => DeliveryType::class,
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function stopDeskCompany(): BelongsTo
    {
        return $this->belongsTo(DeliveryCompany::class, 'stop_desk_company_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(OrderNote::class);
    }
}
