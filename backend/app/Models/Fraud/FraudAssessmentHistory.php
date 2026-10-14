<?php

namespace App\Models\Fraud;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FraudAssessmentHistory extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'fraud_assessment_id',
        'old_score',
        'new_score',
        'old_risk_level',
        'new_risk_level',
        'trigger',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(FraudAssessment::class, 'fraud_assessment_id');
    }
}
