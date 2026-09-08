@php
    $periods = $this->getPeriods();
    $revenueProfit = $this->getRevenueProfit();
    $expenses = $this->getExpenses();
    $kpiRates = $this->getKpiRates();
    $clientMetrics = $this->getClientMetrics();
    $evolution = $this->getSalesEvolution();

    $icon = fn (string $name) => match ($name) {
        'dollar' => '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.725 0 1.45.22 2.003.659l.879.659M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
        'building' => '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72" />',
        'users' => '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />',
        'truck' => '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.622-.977-1.192-.837a48.42 48.42 0 0 0-9.958 2.166.75.75 0 0 0-.516.717v9.089m11.666 0h-11.666" />',
        'clock' => '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
        default => '',
    };

    $gauge = function (string $label, ?float $value) {
        $radius = 46;
        $circumference = 2 * M_PI * $radius;
        $offset = $value !== null ? $circumference * (1 - min(max($value, 0), 100) / 100) : $circumference;
        $color = $value === null ? 'rgba(148, 163, 184, 0.35)' : ($value >= 60 ? 'rgb(22, 163, 74)' : ($value >= 30 ? 'rgb(217, 119, 6)' : 'rgb(220, 38, 38)'));

        return compact('label', 'value', 'radius', 'circumference', 'offset', 'color');
    };

    $gauges = [
        $gauge('Taux de Confirmation', $kpiRates['tauxConfirmation']),
        $gauge('Taux de Livraison', $kpiRates['tauxLivraison']),
        $gauge('Performance de conf.', null),
        $gauge('Performance de livr.', null),
    ];

    $evolutionSeries = $evolution[$this->evolutionMode] ?? $evolution['ventes'];
    $evolutionMax = max(1, ...$evolutionSeries) ?: 1;
    $evolutionPointCount = max(count($evolutionSeries) - 1, 1);
    $evolutionPoints = collect($evolutionSeries)
        ->map(function ($value, $index) use ($evolutionPointCount, $evolutionMax) {
            $x = ($index / $evolutionPointCount) * 580;
            $y = 140 - (($value / $evolutionMax) * 120);

            return round($x, 1).','.round($y, 1);
        })
        ->join(' ');
    $evolutionAreaPoints = '0,140 '.$evolutionPoints.' 580,140';
@endphp

<style>
    .db-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.625rem;
        border-radius: 0.875rem;
        background: rgba(148, 163, 184, 0.06);
        border: 1px solid rgba(148, 163, 184, 0.16);
        margin-bottom: 1.25rem;
    }

    .db-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
    }

    .db-tab {
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.8125rem;
        font-weight: 600;
        border: 1px solid transparent;
        cursor: pointer;
        background: transparent;
        color: inherit;
        opacity: 0.65;
        transition: 0.15s ease;
    }

    .db-tab:hover {
        opacity: 1;
    }

    .db-tab.is-active {
        background: rgba(245, 158, 11, 0.16);
        border-color: rgba(245, 158, 11, 0.5);
        color: rgb(217, 119, 6);
        opacity: 1;
    }

    .db-card {
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 1rem;
        padding: 1.25rem;
        background: rgba(148, 163, 184, 0.045);
    }

    .db-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        gap: 0.75rem;
    }

    .db-panel-title {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        font-size: 0.875rem;
        font-weight: 700;
    }

    .db-panel-title-icon {
        width: 2rem;
        height: 2rem;
        border-radius: 0.625rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(148, 163, 184, 0.14);
        flex-shrink: 0;
    }

    .db-panel-title-icon svg {
        width: 1.125rem;
        height: 1.125rem;
    }

    .db-soon {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        min-height: 8rem;
        text-align: center;
    }

    .db-soon svg {
        width: 1.75rem;
        height: 1.75rem;
        opacity: 0.5;
    }

    .db-soon-text {
        font-size: 0.8125rem;
        font-weight: 700;
        opacity: 0.6;
        letter-spacing: 0.02em;
    }

    .db-kv-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .db-kv-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.625rem 0.75rem;
        border-radius: 0.625rem;
        background: rgba(148, 163, 184, 0.05);
    }

    .db-kv-label {
        font-size: 0.8125rem;
        font-weight: 600;
        opacity: 0.85;
    }

    .db-kv-value {
        font-size: 0.875rem;
        font-weight: 700;
        white-space: nowrap;
    }

    .db-kv-value.is-soon {
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        opacity: 0.55;
        text-transform: uppercase;
    }

    .db-kpi-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 15rem;
        grid-template-rows: auto auto;
        gap: 1rem;
        margin-bottom: 1.25rem;
    }

    .db-kpi-revenue {
        grid-column: 1;
        grid-row: 1;
    }

    .db-kpi-expenses {
        grid-column: 2;
        grid-row: 1;
    }

    .db-kpi-clients {
        grid-column: 1;
        grid-row: 2;
    }

    .db-kpi-delivery {
        grid-column: 2;
        grid-row: 2;
    }

    .db-kpi-performance {
        grid-column: 3;
        grid-row: 1 / span 2;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
    }

    .db-gauge {
        position: relative;
        width: 7.5rem;
        height: 7.5rem;
    }

    .db-gauge svg {
        width: 100%;
        height: 100%;
    }

    .db-gauge-text {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .db-gauge-value {
        font-size: 1.125rem;
        font-weight: 700;
    }

    .db-gauge-value.is-soon {
        opacity: 0.45;
    }

    .db-gauge-label {
        margin-top: 0.125rem;
        font-size: 0.625rem;
        font-weight: 600;
        opacity: 0.6;
        text-align: center;
        padding: 0 0.5rem;
    }

    .db-evolution-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .db-evolution-title {
        font-size: 0.9375rem;
        font-weight: 700;
    }

    .db-evolution-toggle {
        display: flex;
        gap: 0.25rem;
        padding: 0.25rem;
        border-radius: 9999px;
        background: rgba(148, 163, 184, 0.12);
    }

    .db-evolution-btn {
        padding: 0.375rem 0.875rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: none;
        cursor: pointer;
        background: transparent;
        color: inherit;
        opacity: 0.6;
    }

    .db-evolution-btn.is-active {
        background: rgb(15, 23, 42);
        color: rgb(255, 255, 255);
        opacity: 1;
    }

    .db-evolution-chart {
        width: 100%;
        overflow-x: auto;
    }

    .db-evolution-chart svg {
        width: 100%;
        height: 12rem;
        display: block;
    }

    .db-evolution-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 0.375rem;
        font-size: 0.6875rem;
        opacity: 0.55;
    }

    @media (max-width: 1024px) {
        .db-kpi-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        }

        .db-kpi-revenue,
        .db-kpi-expenses,
        .db-kpi-clients,
        .db-kpi-delivery,
        .db-kpi-performance {
            grid-column: 1;
            grid-row: auto;
        }

        .db-kpi-performance {
            flex-direction: row;
            flex-wrap: wrap;
        }
    }
</style>

<x-filament-panels::page>
    <div class="db-toolbar">
        <div class="db-tabs">
            @foreach ($periods as $key => $label)
                <button
                    type="button"
                    wire:click="setPeriod('{{ $key }}')"
                    class="db-tab {{ $this->period === $key ? 'is-active' : '' }}"
                >
                    {{ $label }}
                </button>
            @endforeach
        </div>
    </div>

    <div class="db-kpi-grid">
        <div class="db-card db-kpi-revenue">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('dollar') !!}
                        </svg>
                    </span>
                    Revenus & Profits
                </div>
            </div>
            <div class="db-kv-list">
                <div class="db-kv-row">
                    <span class="db-kv-label">Ventes</span>
                    <span class="db-kv-value">{{ $revenueProfit['ventes'] }} (DZD)</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Revenus</span>
                    <span class="db-kv-value">{{ $revenueProfit['revenus'] }} (DZD)</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Bénéfices</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Retour sur investissement (ROI)</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Upsell</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Capital</span>
                    <span class="db-kv-value">{{ $revenueProfit['capital'] }} (DZD)</span>
                </div>
            </div>
        </div>

        <div class="db-card db-kpi-expenses">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('building') !!}
                        </svg>
                    </span>
                    Dépenses & Frais
                </div>
            </div>
            <div class="db-kv-list">
                <div class="db-kv-row">
                    <span class="db-kv-label">Charges</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Frais de livraison</span>
                    <span class="db-kv-value">{{ $expenses['fraisLivraison'] }} (DZD)</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Frais de retour</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Coût des Produits</span>
                    <span class="db-kv-value">{{ $expenses['coutProduits'] }} (DZD)</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Ventes Marketers</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Frais d'agent</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
            </div>
        </div>

        <div class="db-card db-kpi-performance">
            @foreach ($gauges as $g)
                <div class="db-gauge">
                    <svg viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="{{ $g['radius'] }}" stroke="rgba(148, 163, 184, 0.2)" stroke-width="10" fill="none" />
                        <circle
                            cx="60" cy="60" r="{{ $g['radius'] }}"
                            stroke="{{ $g['color'] }}"
                            stroke-width="10"
                            fill="none"
                            stroke-linecap="round"
                            stroke-dasharray="{{ $g['circumference'] }}"
                            stroke-dashoffset="{{ $g['offset'] }}"
                            transform="rotate(-90 60 60)"
                        />
                    </svg>
                    <div class="db-gauge-text">
                        <span class="db-gauge-value {{ $g['value'] === null ? 'is-soon' : '' }}">
                            {{ $g['value'] !== null ? number_format($g['value'], 0, ',', ' ').' %' : '—' }}
                        </span>
                        <span class="db-gauge-label">{{ $g['label'] }}</span>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="db-card db-kpi-clients">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('users') !!}
                        </svg>
                    </span>
                    Métriques Clients
                </div>
            </div>
            <div class="db-kv-list">
                <div class="db-kv-row">
                    <span class="db-kv-label">Acheteurs</span>
                    <span class="db-kv-value">{{ $clientMetrics['acheteurs'] }}</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Taux d'acquisition</span>
                    <span class="db-kv-value">{{ number_format($clientMetrics['tauxAcquisition'], 0, ',', ' ') }} %</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Taux de rétention</span>
                    <span class="db-kv-value">{{ number_format($clientMetrics['tauxRetention'], 0, ',', ' ') }} %</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Valeur moyenne par commande (AOV)</span>
                    <span class="db-kv-value">{{ $clientMetrics['aov'] }} (DZD)</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Valeur du profit par commande (POV)</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Valeur moyenne de l'acheteur (ACV)</span>
                    <span class="db-kv-value">{{ $clientMetrics['acv'] }} (DZD)</span>
                </div>
                <div class="db-kv-row">
                    <span class="db-kv-label">Valeur de profit par acheteur (PCV)</span>
                    <span class="db-kv-value is-soon">Bientôt Disponible</span>
                </div>
            </div>
        </div>

        <div class="db-card db-kpi-delivery">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('truck') !!}
                        </svg>
                    </span>
                    Impact de Livraison
                </div>
            </div>
            <div class="db-soon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    {!! $icon('clock') !!}
                </svg>
                <span class="db-soon-text">Bientôt Disponible</span>
            </div>
        </div>
    </div>

    <div class="db-card">
        <div class="db-evolution-header">
            <div class="db-evolution-title">Évolution des ventes</div>
            <div class="db-evolution-toggle">
                <button
                    type="button"
                    wire:click="setEvolutionMode('montant')"
                    class="db-evolution-btn {{ $this->evolutionMode === 'montant' ? 'is-active' : '' }}"
                >
                    Montant
                </button>
                <button
                    type="button"
                    wire:click="setEvolutionMode('capital')"
                    class="db-evolution-btn {{ $this->evolutionMode === 'capital' ? 'is-active' : '' }}"
                >
                    Capital
                </button>
            </div>
        </div>

        <div class="db-evolution-chart">
            <svg viewBox="0 0 580 150" preserveAspectRatio="none">
                <polygon points="{{ $evolutionAreaPoints }}" fill="rgba(245, 158, 11, 0.12)" />
                <polyline points="{{ $evolutionPoints }}" fill="none" stroke="rgb(217, 119, 6)" stroke-width="2" />
            </svg>
        </div>
        <div class="db-evolution-labels">
            <span>{{ $evolution['labels'][0] ?? '' }}</span>
            <span>{{ $evolution['labels'][intdiv(count($evolution['labels']), 2)] ?? '' }}</span>
            <span>{{ $evolution['labels'][count($evolution['labels']) - 1] ?? '' }}</span>
        </div>
    </div>
</x-filament-panels::page>
