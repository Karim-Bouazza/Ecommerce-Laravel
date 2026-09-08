@php
    $periods = $this->getPeriods();
    $stats = $this->getStats();
    $topProducts = $this->getTopProducts();
    $topWilayas = $this->getTopWilayas();
    $topDeliveryCompanies = $this->getTopDeliveryCompanies();
    $topClients = $this->getTopClients();

    $statColors = [
        'orange' => ['bg' => 'rgba(245, 158, 11, 0.15)', 'text' => 'rgb(217, 119, 6)'],
        'teal' => ['bg' => 'rgba(5, 150, 105, 0.15)', 'text' => 'rgb(5, 150, 105)'],
        'green' => ['bg' => 'rgba(34, 197, 94, 0.15)', 'text' => 'rgb(22, 163, 74)'],
        'blue' => ['bg' => 'rgba(59, 130, 246, 0.15)', 'text' => 'rgb(37, 99, 235)'],
    ];

    $icon = fn (string $name) => match ($name) {
        'cart' => '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />',
        'check' => '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
        'truck' => '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.622-.977-1.192-.837a48.42 48.42 0 0 0-9.958 2.166.75.75 0 0 0-.516.717v9.089m11.666 0h-11.666" />',
        'dollar' => '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.725 0 1.45.22 2.003.659l.879.659M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
        'box' => '<path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />',
        'pin' => '<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />',
        'building' => '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72" />',
        'users' => '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />',
        'headset' => '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />',
        'user' => '<path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />',
        'chart' => '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />',
        'clock' => '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
        default => '',
    };
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

    .db-mode-toggle {
        display: flex;
        gap: 0.25rem;
        padding: 0.25rem;
        border-radius: 9999px;
        background: rgba(148, 163, 184, 0.12);
    }

    .db-mode-btn {
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

    .db-mode-btn.is-active {
        background: rgb(15, 23, 42);
        color: rgb(255, 255, 255);
        opacity: 1;
    }

    .db-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1.25rem;
    }

    .db-card {
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 1rem;
        padding: 1.25rem;
        background: rgba(148, 163, 184, 0.045);
    }

    .db-stat-card {
        display: flex;
        align-items: center;
        gap: 0.875rem;
    }

    .db-stat-icon {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .db-stat-icon svg {
        width: 1.375rem;
        height: 1.375rem;
    }

    .db-stat-label {
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        opacity: 0.6;
        text-transform: uppercase;
    }

    .db-stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 0.125rem;
        line-height: 1.2;
    }

    .db-stat-change {
        font-size: 0.75rem;
        font-weight: 700;
        margin-top: 0.25rem;
    }

    .db-stat-change.is-up {
        color: rgb(5, 150, 105);
    }

    .db-stat-change.is-down {
        color: rgb(220, 38, 38);
    }

    .db-online-card {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        margin-bottom: 1.25rem;
    }

    .db-online-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(148, 163, 184, 0.14);
        flex-shrink: 0;
    }

    .db-online-icon svg {
        width: 1.5rem;
        height: 1.5rem;
    }

    .db-online-title {
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        opacity: 0.6;
        text-transform: uppercase;
    }

    .db-online-divider {
        width: 1px;
        align-self: stretch;
        background: rgba(148, 163, 184, 0.25);
    }

    .db-soon-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        background: rgba(245, 158, 11, 0.12);
        border: 1px solid rgba(245, 158, 11, 0.35);
        color: rgb(217, 119, 6);
    }

    .db-grid-2 {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1.25rem;
    }

    .db-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1.25rem;
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

    .db-panel-chart-icon {
        opacity: 0.4;
        flex-shrink: 0;
    }

    .db-panel-chart-icon svg {
        width: 1.125rem;
        height: 1.125rem;
    }

    .db-list {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        min-height: 8rem;
    }

    .db-list-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.625rem 0.75rem;
        border-radius: 0.625rem;
        background: rgba(148, 163, 184, 0.05);
    }

    .db-list-rank {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 9999px;
        background: rgba(245, 158, 11, 0.15);
        color: rgb(217, 119, 6);
        font-size: 0.6875rem;
        font-weight: 700;
        flex-shrink: 0;
    }

    .db-list-label {
        font-size: 0.8125rem;
        font-weight: 600;
        flex: 1;
    }

    .db-list-value {
        font-size: 0.75rem;
        opacity: 0.65;
        font-weight: 600;
        white-space: nowrap;
    }

    .db-empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 8rem;
        font-size: 0.875rem;
        opacity: 0.55;
        text-align: center;
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

    @media (max-width: 1024px) {
        .db-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .db-grid-2,
        .db-grid-3 {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 640px) {
        .db-stats-grid {
            grid-template-columns: 1fr;
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

        <div class="db-mode-toggle">
            <button
                type="button"
                wire:click="setMode('percentage')"
                class="db-mode-btn {{ $this->mode === 'percentage' ? 'is-active' : '' }}"
            >
                Pourcentage %
            </button>
            <button
                type="button"
                wire:click="setMode('numbers')"
                class="db-mode-btn {{ $this->mode === 'numbers' ? 'is-active' : '' }}"
            >
                # Nombres
            </button>
        </div>
    </div>

    <div class="db-stats-grid">
        @foreach ($stats as $stat)
            @php
                $colors = $statColors[$stat['color']] ?? $statColors['orange'];
            @endphp
            <div class="db-card db-stat-card">
                <div class="db-stat-icon" style="background: {{ $colors['bg'] }}; color: {{ $colors['text'] }};">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon($stat['icon']) !!}
                    </svg>
                </div>
                <div>
                    <div class="db-stat-label">{{ $stat['label'] }}</div>
                    @if ($this->mode === 'percentage' && $stat['change'] !== null)
                        <div class="db-stat-value">{{ $stat['change'] > 0 ? '+' : '' }}{{ number_format($stat['change'], 1, ',', ' ') }} %</div>
                        <div class="db-stat-change {{ $stat['change'] >= 0 ? 'is-up' : 'is-down' }}">
                            vs {{ $stat['value'] }}{{ $stat['suffix'] }}
                        </div>
                    @else
                        <div class="db-stat-value">{{ $stat['value'] }}{{ $stat['suffix'] }}</div>
                    @endif
                </div>
            </div>
        @endforeach
    </div>

    <div class="db-card db-online-card">
        <div class="db-online-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                {!! $icon('user') !!}
            </svg>
        </div>
        <div>
            <div class="db-online-title">Statut des agents en ligne</div>
        </div>
        <div class="db-online-divider"></div>
        <span class="db-soon-badge">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 0.875rem; height: 0.875rem;">
                {!! $icon('clock') !!}
            </svg>
            Bientôt Disponible
        </span>
    </div>

    <div class="db-grid-2">
        <div class="db-card">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('box') !!}
                        </svg>
                    </span>
                    Meilleurs produits
                </div>
                <span class="db-panel-chart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon('chart') !!}
                    </svg>
                </span>
            </div>

            @if ($topProducts->isEmpty())
                <div class="db-empty">Aucune donnée trouvée</div>
            @else
                <div class="db-list">
                    @foreach ($topProducts as $index => $row)
                        <div class="db-list-row">
                            <span class="db-list-rank">{{ $index + 1 }}</span>
                            <span class="db-list-label">{{ $row['label'] }}</span>
                            <span class="db-list-value">{{ $row['value'] }}</span>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        <div class="db-card">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('pin') !!}
                        </svg>
                    </span>
                    Meilleure Wilaya
                </div>
                <span class="db-panel-chart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon('chart') !!}
                    </svg>
                </span>
            </div>

            @if ($topWilayas->isEmpty())
                <div class="db-empty">Aucune donnée trouvée</div>
            @else
                <div class="db-list">
                    @foreach ($topWilayas as $index => $row)
                        <div class="db-list-row">
                            <span class="db-list-rank">{{ $index + 1 }}</span>
                            <span class="db-list-label">{{ $row['label'] }}</span>
                            <span class="db-list-value">{{ $row['value'] }}</span>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>

    <div class="db-grid-3">
        <div class="db-card">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('building') !!}
                        </svg>
                    </span>
                    Meilleures entreprises de livraison
                </div>
                <span class="db-panel-chart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon('chart') !!}
                    </svg>
                </span>
            </div>

            @if ($topDeliveryCompanies->isEmpty())
                <div class="db-empty">Aucune donnée trouvée</div>
            @else
                <div class="db-list">
                    @foreach ($topDeliveryCompanies as $index => $row)
                        <div class="db-list-row">
                            <span class="db-list-rank">{{ $index + 1 }}</span>
                            <span class="db-list-label">{{ $row['label'] }}</span>
                            <span class="db-list-value">{{ $row['value'] }}</span>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        <div class="db-card">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('users') !!}
                        </svg>
                    </span>
                    Meilleurs clients
                </div>
                <span class="db-panel-chart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon('chart') !!}
                    </svg>
                </span>
            </div>

            @if ($topClients->isEmpty())
                <div class="db-empty">Aucune donnée trouvée</div>
            @else
                <div class="db-list">
                    @foreach ($topClients as $index => $row)
                        <div class="db-list-row">
                            <span class="db-list-rank">{{ $index + 1 }}</span>
                            <span class="db-list-label">{{ $row['label'] }}</span>
                            <span class="db-list-value">{{ $row['value'] }}</span>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        <div class="db-card">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('headset') !!}
                        </svg>
                    </span>
                    Meilleurs agents
                </div>
                <span class="db-panel-chart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon('chart') !!}
                    </svg>
                </span>
            </div>

            <div class="db-soon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    {!! $icon('clock') !!}
                </svg>
                <span class="db-soon-text">Bientôt Disponible</span>
            </div>
        </div>
    </div>

    <div class="db-grid-2">
        <div class="db-card">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('headset') !!}
                        </svg>
                    </span>
                    Meilleurs agents de suivi
                </div>
                <span class="db-panel-chart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon('chart') !!}
                    </svg>
                </span>
            </div>

            <div class="db-soon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    {!! $icon('clock') !!}
                </svg>
                <span class="db-soon-text">Bientôt Disponible</span>
            </div>
        </div>

        <div class="db-card">
            <div class="db-panel-header">
                <div class="db-panel-title">
                    <span class="db-panel-title-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {!! $icon('user') !!}
                        </svg>
                    </span>
                    Meilleurs Marketers
                </div>
                <span class="db-panel-chart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        {!! $icon('chart') !!}
                    </svg>
                </span>
            </div>

            <div class="db-soon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    {!! $icon('clock') !!}
                </svg>
                <span class="db-soon-text">Bientôt Disponible</span>
            </div>
        </div>
    </div>
</x-filament-panels::page>
