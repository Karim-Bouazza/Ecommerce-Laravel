<?php

namespace App\Services\Fraud;

use DeviceDetector\DeviceDetector;

class UserAgentParser
{
    /**
     * @return array{browser_name: ?string, browser_version: ?string, os_name: ?string, os_version: ?string, device_category: ?string}
     */
    public function parse(?string $userAgent): array
    {
        $empty = [
            'browser_name' => null,
            'browser_version' => null,
            'os_name' => null,
            'os_version' => null,
            'device_category' => null,
        ];

        if ($userAgent === null || trim($userAgent) === '') {
            return $empty;
        }

        $detector = new DeviceDetector($userAgent);
        $detector->parse();

        $client = $detector->getClient();
        $os = $detector->getOs();

        return [
            'browser_name' => $this->clean($client['name'] ?? null),
            'browser_version' => $this->clean($client['version'] ?? null),
            'os_name' => $this->clean($os['name'] ?? null),
            'os_version' => $this->clean($os['version'] ?? null),
            'device_category' => $this->clean($detector->getDeviceName()) ?: null,
        ];
    }

    private function clean(mixed $value): ?string
    {
        if (! is_string($value) || $value === '' || $value === 'UNK') {
            return null;
        }

        return mb_substr($value, 0, 64);
    }
}
