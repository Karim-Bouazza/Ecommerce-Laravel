<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
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
            self::Confirmed => 'info',
            self::Packed => 'info',
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
        return match ($this) {
            self::Pending => [self::Confirmed, self::Cancelled],
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
