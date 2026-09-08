@php
    $paid = $entry->paidAmount();
    $remaining = $entry->remainingAmount();

    $badgeColors = [
        'warning' => ['bg' => 'rgba(245, 158, 11, 0.12)', 'border' => 'rgba(245, 158, 11, 0.4)', 'text' => 'rgb(217, 119, 6)'],
        'success' => ['bg' => 'rgba(16, 185, 129, 0.12)', 'border' => 'rgba(16, 185, 129, 0.4)', 'text' => 'rgb(5, 150, 105)'],
        'info' => ['bg' => 'rgba(59, 130, 246, 0.12)', 'border' => 'rgba(59, 130, 246, 0.4)', 'text' => 'rgb(37, 99, 235)'],
        'danger' => ['bg' => 'rgba(239, 68, 68, 0.12)', 'border' => 'rgba(239, 68, 68, 0.4)', 'text' => 'rgb(220, 38, 38)'],
        'gray' => ['bg' => 'rgba(148, 163, 184, 0.12)', 'border' => 'rgba(148, 163, 184, 0.4)', 'text' => 'rgb(100, 116, 139)'],
    ];

    $paymentColor = $badgeColors[$entry->paymentStatus()->color()] ?? $badgeColors['gray'];
    $statusColor = $badgeColors[$entry->status->color()] ?? $badgeColors['gray'];

    $fields = [
        'Date de création' => $entry->created_at?->format('Y-m-d H:i:s'),
        'Entrepôt' => $entry->warehouse?->name,
        'Fournisseur' => $entry->fournisseur?->name,
        'Remarque' => $entry->remark,
    ];
@endphp

<style>
    .pe-info-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .pe-info-reference {
        font-size: 1.125rem;
        font-weight: 700;
    }

    .pe-info-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .pe-info-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        border: 1px solid transparent;
    }

    .pe-info-fields {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 0.75rem;
        margin-top: 1.25rem;
    }

    @media (min-width: 640px) {
        .pe-info-fields {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    .pe-info-field__label {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.03em;
        opacity: 0.65;
    }

    .pe-info-field__value {
        margin-top: 0.125rem;
        font-size: 0.875rem;
    }

    .pe-info-summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
        margin-top: 1.25rem;
    }

    .pe-info-card {
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 0.5rem;
        padding: 0.75rem;
        text-align: center;
    }

    .pe-info-card__label {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.03em;
        opacity: 0.65;
    }

    .pe-info-card__value {
        margin-top: 0.25rem;
        font-size: 1rem;
        font-weight: 600;
    }

    .pe-info-card--paid {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.08);
    }

    .pe-info-card--paid .pe-info-card__label,
    .pe-info-card--paid .pe-info-card__value {
        color: rgb(5, 150, 105);
        opacity: 1;
    }

    .pe-info-card--remaining {
        border-color: rgba(245, 158, 11, 0.45);
        background: rgba(245, 158, 11, 0.08);
    }

    .pe-info-card--remaining .pe-info-card__label,
    .pe-info-card--remaining .pe-info-card__value {
        color: rgb(217, 119, 6);
        opacity: 1;
    }

    .pe-info-section-title {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.8125rem;
        font-weight: 600;
        opacity: 0.75;
    }

    .pe-info-table-wrap {
        overflow-x: auto;
    }

    .pe-info-table {
        width: 100%;
        text-align: start;
        border-collapse: collapse;
    }

    .pe-info-table th,
    .pe-info-table td {
        padding: 0.5rem 0.75rem;
        text-align: start;
        font-size: 0.875rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    }

    .pe-info-table th {
        font-weight: 600;
    }

    .pe-info-empty {
        padding: 1rem 0;
        text-align: center;
        font-size: 0.875rem;
        opacity: 0.65;
    }
</style>

<div class="pe-info-header">
    <div class="pe-info-reference">{{ $entry->reference }}</div>
    <div class="pe-info-badges">
        <span class="pe-info-badge" style="background: {{ $paymentColor['bg'] }}; border-color: {{ $paymentColor['border'] }}; color: {{ $paymentColor['text'] }};">
            {{ $entry->paymentStatus()->label() }}
        </span>
        <span class="pe-info-badge" style="background: {{ $statusColor['bg'] }}; border-color: {{ $statusColor['border'] }}; color: {{ $statusColor['text'] }};">
            {{ $entry->status->label() }}
        </span>
    </div>
</div>

<div class="pe-info-fields">
    @foreach ($fields as $label => $value)
        <div>
            <div class="pe-info-field__label">{{ mb_strtoupper($label) }}</div>
            <div class="pe-info-field__value">{{ $value !== null && $value !== '' ? $value : '—' }}</div>
        </div>
    @endforeach
</div>

<div class="pe-info-summary">
    <div class="pe-info-card">
        <div class="pe-info-card__label">TOTAL</div>
        <div class="pe-info-card__value">{{ number_format($entry->total, 0, ',', ' ') }} DZD</div>
    </div>
    <div class="pe-info-card pe-info-card--paid">
        <div class="pe-info-card__label">PAYÉ</div>
        <div class="pe-info-card__value">{{ number_format($paid, 0, ',', ' ') }} DZD</div>
    </div>
    <div class="pe-info-card pe-info-card--remaining">
        <div class="pe-info-card__label">RESTANT</div>
        <div class="pe-info-card__value">{{ number_format($remaining, 0, ',', ' ') }} DZD</div>
    </div>
</div>

<div class="pe-info-section-title">Produits</div>

<div class="pe-info-table-wrap">
    @if ($entry->items->isEmpty())
        <p class="pe-info-empty">Aucun produit.</p>
    @else
        <table class="pe-info-table">
            <thead>
                <tr>
                    <th>Nom du produit</th>
                    <th>Variante</th>
                    <th>Quantité</th>
                    <th>Prix d'achat (DZD)</th>
                    <th>Sous-total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($entry->items as $item)
                    <tr>
                        <td>{{ $item->product?->name ?? '—' }}</td>
                        <td>{{ $item->variant ?: '—' }}</td>
                        <td>{{ number_format($item->quantity, 0, ',', ' ') }}</td>
                        <td>{{ number_format($item->purchase_price, 0, ',', ' ') }}</td>
                        <td style="font-weight: 600;">{{ number_format($item->subtotal, 0, ',', ' ') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>
