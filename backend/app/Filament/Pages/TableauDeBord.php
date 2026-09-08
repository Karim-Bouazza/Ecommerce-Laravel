<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\DeliveredOrdersChart;
use App\Filament\Widgets\OrderStatsOverview;
use App\Filament\Widgets\ProductPerformanceTable;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class TableauDeBord extends BaseDashboard
{
    use HasFiltersForm;

    protected static string $routePath = 'tableau-de-bord';

    protected static ?string $navigationLabel = 'Tableau de Bord';

    protected static ?string $title = 'Tableau de Bord';

    protected static ?int $navigationSort = -1;

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('tableau_de_bord.view') ?? false;
    }

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

    public function getWidgets(): array
    {
        return [
            OrderStatsOverview::class,
            ProductPerformanceTable::class,
            DeliveredOrdersChart::class,
        ];
    }
}
