<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
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
    case Packed = 'packed';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Returned = 'returned';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente de confirmation',
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
            self::Packed => 'Emballée',
            self::Shipped => 'Expédiée',
            self::Delivered => 'Livrée',
            self::Returned => 'Retour',
            self::Cancelled => 'Annulée',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Call1, self::Call2, self::Call3 => 'warning',
            self::Unreachable, self::Duplicated => 'gray',
            self::ToCheck => 'indigo',
            self::FakeOrder => 'danger',
            self::ConfirmedBot => 'info',
            self::ConfirmedNoStock => 'purple',
            self::Scheduled => 'indigo',
            self::Confirmed => 'info',
            self::Packed => 'purple',
            self::Shipped => 'primary',
            self::Delivered => 'success',
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
            self::Pending => [
                self::Call1, self::Call2, self::Call3,
                self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder,
                self::Confirmed, self::ConfirmedBot, self::ConfirmedNoStock,
                self::Scheduled, self::Cancelled,
            ],
            self::Call1 => [self::Call2, self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder, ...$confirmationOutcomes],
            self::Call2 => [self::Call3, self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder, ...$confirmationOutcomes],
            self::Call3 => [self::Unreachable, self::ToCheck, self::Duplicated, self::FakeOrder, ...$confirmationOutcomes],
            self::Unreachable => [self::Call1, ...$confirmationOutcomes],
            self::ToCheck => [self::Unreachable, ...$confirmationOutcomes],
            self::Duplicated, self::FakeOrder => [self::Cancelled],
            self::ConfirmedNoStock => [self::Confirmed, self::Cancelled],
            self::ConfirmedBot => [self::Packed, self::Cancelled],
            self::Scheduled => [self::Confirmed, self::Cancelled],
            self::Confirmed => [self::Packed, self::Cancelled],
            self::Packed => [self::Shipped, self::Cancelled],
            self::Shipped => [self::Delivered, self::Returned, self::Cancelled],
            self::Delivered => [self::Returned, self::Cancelled],
            self::Returned, self::Cancelled => [],
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
}
