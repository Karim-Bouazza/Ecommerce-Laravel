<?php

namespace App\Models\Fraud;

use App\Enums\Fraud\FraudRiskLevel;
use App\Models\Order\Order;
use App\Models\Order\OrderAttempt;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FraudAssessment extends Model
{
    protected $fillable = [
        'order_id',
        'order_attempt_id',
        'score',
        'risk_level',
        'recommended_action',
        'daily_points',
        'historical_points',
        'outcome_points',
        'excluded_ip_points',
        'counts',
        'historical',
        'reasons',
        'rules_version',
        'assessed_at',
    ];

    protected $casts = [
        'risk_level' => FraudRiskLevel::class,
        'counts' => 'array',
        'historical' => 'array',
        'reasons' => 'array',
        'assessed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(OrderAttempt::class, 'order_attempt_id');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(FraudAssessmentHistory::class);
    }
}
