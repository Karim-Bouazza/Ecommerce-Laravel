<?php

namespace App\States\Order;

use App\Enums\Order\OrderStatus;
use App\States\Order\Transitions\AssignOrder;
use App\States\Order\Transitions\DeliverOrder;
use App\States\Order\Transitions\ReportOrder;
use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

abstract class OrderState extends State
{
    private const CONFIRMATION_OUTCOMES = [
        Confirmed::class,
        ConfirmedBot::class,
        ConfirmedNoStock::class,
        Cancelled::class,
    ];

    private const EDITABLE = [
        Pending::class,
        Reported::class,
        Call1::class,
        Call2::class,
        Call3::class,
        Unreachable::class,
        ConfirmedBot::class,
        ConfirmedNoStock::class,
        Confirmed::class,
    ];

    private const DELETABLE = [
        Pending::class,
        Cancelled::class,
    ];

    public static function config(): StateConfig
    {
        $config = parent::config()->default(Pending::class);

        foreach (self::transitions() as $from => $targets) {
            foreach ($targets as $to) {
                $config->allowTransition($from, $to, match ($to) {
                    Assigned::class => AssignOrder::class,
                    Delivered::class => DeliverOrder::class,
                    Reported::class => ReportOrder::class,
                    default => null,
                });
            }
        }

        return $config;
    }

    /**
     * @return array<class-string<self>, array<int, class-string<self>>>
     */
    private static function transitions(): array
    {
        return [
            Pending::class => [
                Reported::class,
                Call1::class,
                Call2::class,
                Call3::class,
                Unreachable::class,
                ToCheck::class,
                Duplicated::class,
                FakeOrder::class,
                ...self::CONFIRMATION_OUTCOMES,
            ],
            Reported::class => [
                Call1::class,
                Call2::class,
                Call3::class,
                Unreachable::class,
                ToCheck::class,
                Duplicated::class,
                FakeOrder::class,
                ...self::CONFIRMATION_OUTCOMES,
            ],
            Call1::class => [Call2::class, Call3::class, Unreachable::class, ToCheck::class, Duplicated::class, FakeOrder::class, ...self::CONFIRMATION_OUTCOMES],
            Call2::class => [Call3::class, Unreachable::class, ToCheck::class, Duplicated::class, FakeOrder::class, ...self::CONFIRMATION_OUTCOMES],
            Call3::class => [Unreachable::class, ToCheck::class, Duplicated::class, FakeOrder::class, ...self::CONFIRMATION_OUTCOMES],
            Unreachable::class => [Call1::class, ...self::CONFIRMATION_OUTCOMES],
            ToCheck::class => [Unreachable::class, ...self::CONFIRMATION_OUTCOMES],
            Duplicated::class => [Cancelled::class],
            FakeOrder::class => [Cancelled::class],
            ConfirmedNoStock::class => [Confirmed::class, Cancelled::class],
            ConfirmedBot::class => [Assigned::class, Cancelled::class],
            Scheduled::class => [Confirmed::class, Cancelled::class],
            Confirmed::class => [ConfirmedNoStock::class, Assigned::class, Cancelled::class],
            Assigned::class => [Shipped::class, Cancelled::class],
            Shipped::class => [Delivered::class, ReturnInProgress::class, Returned::class, Unreachable::class, Cancelled::class],
            ReturnInProgress::class => [Returned::class],
            Cancelled::class => [Pending::class],
        ];
    }

    public function status(): OrderStatus
    {
        return OrderStatus::from(static::getMorphClass());
    }

    public function label(): string
    {
        return $this->status()->label();
    }

    public function color(): string
    {
        return $this->status()->color();
    }

    public function isEditable(): bool
    {
        return in_array(static::class, self::EDITABLE, true);
    }

    public function canBeDeleted(): bool
    {
        return in_array(static::class, self::DELETABLE, true);
    }

    /**
     * @return array<int, OrderStatus>
     */
    public function allowedTransitions(): array
    {
        return array_map(
            fn (string $name) => OrderStatus::from($name),
            $this->transitionableStates(),
        );
    }
}
