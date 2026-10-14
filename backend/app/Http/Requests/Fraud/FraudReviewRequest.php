<?php

namespace App\Http\Requests\Fraud;

use App\Enums\Fraud\FraudReviewLabel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FraudReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->hasPermission('fraud.review');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $label = FraudReviewLabel::tryFrom((string) $this->input('label'));

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
