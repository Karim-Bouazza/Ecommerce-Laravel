<?php

namespace App\Models\Fraud;

use App\Enums\Fraud\FraudReviewLabel;
use App\Models\Order\Order;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FraudReview extends Model
{
    protected $fillable = [
        'order_id',
        'label',
        'reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'label' => FraudReviewLabel::class,
        'reviewed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
