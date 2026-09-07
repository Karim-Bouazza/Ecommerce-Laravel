<?php

namespace App\Filament\Pages\Finances\Widgets;

use App\Enums\WalletTransactionType;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class WalletStatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $balance = Wallet::query()->sum('balance');
        $entries = WalletTransaction::query()->where('type', WalletTransactionType::In)->sum('amount');
        $exits = WalletTransaction::query()->where('type', WalletTransactionType::Out)->sum('amount');

        return [
            Stat::make('Solde', number_format($balance, 0, ',', ' ').' (DZD)')
                ->icon(Heroicon::OutlinedWallet)
                ->color('primary'),
            Stat::make('Entrée', number_format($entries, 0, ',', ' ').' (DZD)')
                ->icon(Heroicon::OutlinedArrowDownTray)
                ->color('success'),
            Stat::make('Sortie', number_format($exits, 0, ',', ' ').' (DZD)')
                ->icon(Heroicon::OutlinedBuildingLibrary)
                ->color('danger'),
        ];
    }
}
