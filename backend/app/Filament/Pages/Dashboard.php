<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    public function filtersForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('period')
                    ->label('Période')
                    ->options([
                        'today' => "Aujourd'hui",
                        'week' => 'Cette semaine',
                        'month' => 'Ce mois-ci',
                        'year' => 'Cette année',
                        'all' => 'Tout',
                        'custom' => 'Personnalisée',
                    ])
                    ->default('all')
                    ->native(false)
                    ->live(),
                DatePicker::make('from')
                    ->label('Du')
                    ->visible(fn (Get $get) => $get('period') === 'custom'),
                DatePicker::make('until')
                    ->label('Au')
                    ->visible(fn (Get $get) => $get('period') === 'custom'),
            ]);
    }
}
