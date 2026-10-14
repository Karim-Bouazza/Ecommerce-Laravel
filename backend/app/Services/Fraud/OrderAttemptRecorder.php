<?php

namespace App\Services\Fraud;

use App\Enums\Order\OrderAttemptStatus;
use App\Models\Order\Order;
use App\Models\Order\OrderAttempt;
use Illuminate\Http\Request;

class OrderAttemptRecorder
{
    public function __construct(
        private readonly IdentifierNormalizer $normalizer,
        private readonly MatchingKeyHasher $hasher,
        private readonly UserAgentParser $userAgentParser,
    ) {}

    /**
     * IP and User-Agent always come from the HTTP request itself. The
     * fingerprint is client supplied: it is only a correlation hint, hashed
     * like the other identifiers, never proof of identity.
     *
     * @param  array<string, mixed>  $input  Submitted data, used when no order exists.
     */
    public function record(
        Request $request,
        OrderAttemptStatus $status,
        array $input = [],
        ?Order $order = null,
    ): OrderAttempt {
        $ip = $this->normalizer->ip($request->ip());
        $userAgent = $request->userAgent();

        if ($order) {
            $order->loadMissing('client');
            $phone = $order->client?->phone_number;
            $address = $this->normalizer->address($order->address, $order->provider_wilaya_id, $order->provider_commune_id);
        } else {
            $phone = $input['phone_number'] ?? null;
            $address = $this->normalizer->address(
                $input['address'] ?? null,
                $input['provider_wilaya_id'] ?? null,
                $input['provider_commune_id'] ?? null,
            );
        }

        $fingerprint = $this->normalizer->fingerprint(
            is_string($input['fingerprint'] ?? null) ? $input['fingerprint'] : null
        );

        return OrderAttempt::create([
            'order_id' => $order?->id,
            'fingerprint_key' => $this->hasher->make('fingerprint', $fingerprint),
            'ip_key' => $this->hasher->make('ip', $ip),
            'ip_address' => $ip,
            'user_agent' => $userAgent ? mb_substr($userAgent, 0, 1000) : null,
            ...$this->userAgentParser->parse($userAgent),
            'phone_key' => $this->hasher->make('phone', $this->normalizer->phone(is_string($phone) ? $phone : null)),
            'address_key' => $this->hasher->make('address', $address),
            'status' => $status,
            'created_at' => now(),
        ]);
    }
}
