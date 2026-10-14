<?php

namespace App\Http\Requests\Marketing;

use App\Models\Marketing\PixelExcludedIp;
use App\Services\PixelTracking\ExcludedIpMatcher;
use Illuminate\Foundation\Http\FormRequest;

class StorePixelExcludedIpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('pixels.create');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'pattern' => ['required', 'string', 'max:45', function (string $attribute, mixed $value, \Closure $fail) {
                $normalized = ExcludedIpMatcher::normalize((string) $value);

                if ($normalized === null) {
                    $fail('Format invalide. Utilisez une IP (203.0.113.10), un joker (123.32.58.*) ou un CIDR (123.32.58.0/24).');
                } elseif (PixelExcludedIp::query()->pluck('pattern')->contains(
                    fn (string $existing) => ExcludedIpMatcher::canonical($existing) === ExcludedIpMatcher::canonical($normalized)
                )) {
                    $fail('Cette adresse est déjà dans la liste.');
                }
            }],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
