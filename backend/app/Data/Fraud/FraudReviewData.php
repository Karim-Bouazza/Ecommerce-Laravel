<?php

namespace App\Data\Fraud;

use App\Enums\Fraud\FraudReviewLabel;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class FraudReviewData extends Data
{
    public function __construct(
        public FraudReviewLabel $label,
        public ?string $reason = null,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        $label = FraudReviewLabel::tryFrom((string) ($context->payload['label'] ?? ''));

        return [
            'label' => ['required', Rule::in(array_column(FraudReviewLabel::cases(), 'value'))],
            'reason' => [
                $label?->requiresReason() ? 'required' : 'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
}
