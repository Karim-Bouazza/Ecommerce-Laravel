<?php

return [
    // Bump when weights/rules change so stored assessments stay interpretable.
    'rules_version' => '1.1.0',

    // Business timezone that defines the "calendar day" for daily activity.
    'timezone' => env('FRAUD_TIMEZONE', 'Africa/Algiers'),

    // Server-only secret for HMAC matching keys. Never expose it to the frontend.
    // Changing it invalidates every existing matching key.
    'hmac_key' => env('FRAUD_HMAC_KEY'),

    'daily' => [
        'cap' => 40,
        // Points per order after the first one seen today for the identifier.
        'weights' => [
            'fingerprint' => 5,
            'phone' => 3,
            'ip' => 1,
            'address' => 1,
        ],
    ],

    'historical' => [
        'cap' => 60,
        // Points when the identifier is linked to a previously CONFIRMED_FAKE order.
        'weights' => [
            'fingerprint' => 40,
            'phone' => 35,
            'address' => 25,
            'ip' => 10,
        ],
    ],

    // The project stores no cancellation/refusal reasons, so this rule is off by
    // default. When enabled, earlier orders of the same phone whose status is in
    // `statuses` (and not reviewed LEGITIMATE) count once at least `min_count`
    // exist; each awards `points_per_order`, capped at `cap`.
    'outcome' => [
        'enabled' => (bool) env('FRAUD_OUTCOME_ENABLED', false),
        'statuses' => ['returned'],
        'min_count' => 2,
        'points_per_order' => 5,
        'cap' => 10,
    ],

    'excluded_ip' => [
        'cap' => 20,
        'tiers' => [
            [1.0, 20],
            [0.75, 12],
            [0.5, 6],
            [0.25, 2],
            [0.0, 1],
        ],
    ],

    'levels' => [
        'medium' => 25,
        'high' => 50,
        'critical' => 75,
    ],
];
