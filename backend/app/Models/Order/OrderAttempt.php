<?php

namespace App\Models\Order;

use App\Enums\Order\OrderAttemptStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderAttempt extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'fingerprint_key',
        'ip_key',
        'ip_address',
        'user_agent',
        'browser_name',
        'browser_version',
        'os_name',
        'os_version',
        'device_category',
        'phone_key',
        'address_key',
        'status',
        'created_at',
    ];

    protected $casts = [
        'status' => OrderAttemptStatus::class,
        'created_at' => 'datetime',
    ];

    protected $hidden = ['ip_address', 'user_agent'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
