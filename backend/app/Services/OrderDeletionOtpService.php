<?php

namespace App\Services;

use App\Mail\OrderDeletionOtpMail;
use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use RuntimeException;

class OrderDeletionOtpService
{
    private const OTP_TTL_MINUTES = 5;

    private const MAX_VERIFY_ATTEMPTS = 5;

    private const MAX_SENDS_PER_WINDOW = 3;

    private const SEND_WINDOW_MINUTES = 10;

    public function send(Order $order, int $requestedByUserId): void
    {
        $sendLimiterKey = "order-delete-otp-send:{$order->id}:{$requestedByUserId}";

        if (RateLimiter::tooManyAttempts($sendLimiterKey, self::MAX_SENDS_PER_WINDOW)) {
            $seconds = RateLimiter::availableIn($sendLimiterKey);

            throw new RuntimeException("Trop de demandes. Réessayez dans {$seconds} secondes.");
        }

        RateLimiter::hit($sendLimiterKey, self::SEND_WINDOW_MINUTES * 60);

        $code = (string) random_int(100000, 999999);

        Cache::put(
            $this->cacheKey($order, $requestedByUserId),
            [
                'hash' => Hash::make($code),
                'attempts' => 0,
            ],
            now()->addMinutes(self::OTP_TTL_MINUTES)
        );

        Mail::to(config('services.order_deletion_otp.recipient'))
            ->send(new OrderDeletionOtpMail($order, $code));
    }

    public function verify(Order $order, int $requestedByUserId, string $code): bool
    {
        $key = $this->cacheKey($order, $requestedByUserId);
        $entry = Cache::get($key);

        if (! is_array($entry)) {
            return false;
        }

        if ($entry['attempts'] >= self::MAX_VERIFY_ATTEMPTS) {
            Cache::forget($key);

            return false;
        }

        if (! Hash::check($code, $entry['hash'])) {
            $entry['attempts']++;
            Cache::put($key, $entry, now()->addMinutes(self::OTP_TTL_MINUTES));

            return false;
        }

        Cache::forget($key);

        return true;
    }

    private function cacheKey(Order $order, int $userId): string
    {
        return "order-delete-otp:{$order->id}:{$userId}";
    }
}
