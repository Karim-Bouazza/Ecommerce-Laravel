<?php

namespace App\Enums;

enum OrderStatus: string
{
    case New = 'pending';
    case Call1 = 'call_1';
    case Call2 = 'call_2';
    case Call3 = 'call_3';
    case Unreachable = 'unreachable';
    case ToCheck = 'to_check';
    case Duplicated = 'duplicated';
    case FakeOrder = 'fake_order';
    case ConfirmedBot = 'confirmed_bot';
    case ConfirmedNoStock = 'confirmed_no_stock';
    case Scheduled = 'scheduled';
    case Confirmed = 'confirmed';
    case Assigned = 'assigned';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case ReturnInProgress = 'return_in_progress';
    case Returned = 'returned';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Nouvelle',
            self::Call1 => 'Appel 1',
            self::Call2 => 'Appel 2',
            self::Call3 => 'Appel 3',
            self::Unreachable => 'Injoignable',
            self::ToCheck => 'À vérifier',
            self::Duplicated => 'Dupliquée',
            self::FakeOrder => 'Fausse commande',
            self::ConfirmedBot => 'Confirmée (Bot)',
            self::ConfirmedNoStock => 'Confirmée sans stock',
            self::Scheduled => 'Planifiée',
            self::Confirmed => 'Confirmée',
            self::Assigned => 'Assignée',
            self::Shipped => 'Expédiée',
            self::Delivered => 'Livrée',
            self::ReturnInProgress => 'En Retour',
            self::Returned => 'Retournée',
            self::Cancelled => 'Annulée',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::New => 'warning',
            self::Call1, self::Call2, self::Call3 => 'warning',
            self::Unreachable, self::Duplicated => 'gray',
            self::ToCheck => 'indigo',
            self::FakeOrder => 'danger',
            self::ConfirmedBot => 'info',
            self::ConfirmedNoStock => 'purple',
            self::Scheduled => 'indigo',
            self::Confirmed => 'info',
            self::Assigned => 'purple',
            self::Shipped => 'primary',
            self::Delivered => 'success',
            self::ReturnInProgress => 'warning',
            self::Returned => 'gray',
            self::Cancelled => 'danger',
        };
    }

    /**
     * Statuses this order can move to next, per the allowed transition table.
     *
     * @return array<int, self>
     */
    public function allowedTransitions(): array
    {
        $confirmationOutcomes = [
            self::Confirmed,
            self::ConfirmedBot,
            self::ConfirmedNoStock,
            self::Cancelled,
        ];

        return match ($this) {
            self::New => [
                self::Call1, self::Call2, self::Call3,
                self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder,
                self::Confirmed, self::ConfirmedBot, self::ConfirmedNoStock,
                self::Cancelled,
            ],
            self::Call1 => [self::Call2, self::Call3, self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder, ...$confirmationOutcomes],
            self::Call2 => [self::Call3, self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder, ...$confirmationOutcomes],
            self::Call3 => [self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder, ...$confirmationOutcomes],
            self::Unreachable => [self::Call1, ...$confirmationOutcomes],
            self::ToCheck => [self::Unreachable, ...$confirmationOutcomes],
            self::Duplicated, self::FakeOrder => [self::Cancelled],
            self::ConfirmedNoStock => [self::Confirmed, self::Cancelled],
            self::ConfirmedBot => [self::Assigned, self::Cancelled],
            self::Scheduled => [self::Confirmed, self::Cancelled],
            self::Confirmed => [self::ConfirmedNoStock, self::Assigned, self::Cancelled],
            self::Assigned => [self::Shipped, self::Cancelled],
            self::Shipped => [self::Delivered, self::ReturnInProgress, self::Returned, self::Unreachable, self::Cancelled],
            self::ReturnInProgress => [self::Returned],
            self::Delivered => [],
            self::Returned, self::Cancelled => [],
        };
    }

    /**
     * Whether a manual order at this status can still have its details edited
     * (client, items, delivery info) — i.e. it's still New or being worked
     * through the call-confirmation flow.
     */
    public function isEditable(): bool
    {
        return match ($this) {
            self::New, self::Call1, self::Call2, self::Call3,
            self::Unreachable, self::ConfirmedBot, self::ConfirmedNoStock, self::Confirmed => true,
            default => false,
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $status) => [$status->value => $status->label()])
            ->all();
    }

    /**
     * Statuses belonging to a sidebar group (nouvelles/en_cours/confirmees/suivi/terminees/annulees).
     *
     * @return array<int, self>
     */
    public static function forGroup(string $group): array
    {
        return match ($group) {
            'nouvelles' => [self::New],
            'en_cours' => [
                self::Call1, self::Call2, self::Call3,
                self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder, self::Scheduled,
                self::ConfirmedBot, self::ConfirmedNoStock,
            ],
            'confirmees' => [self::Confirmed, self::Assigned],
            'suivi' => [self::Shipped],
            'terminees' => [self::Delivered],
            'annulees' => [self::Cancelled, self::Returned, self::ReturnInProgress],
            default => [],
        };
    }
}
