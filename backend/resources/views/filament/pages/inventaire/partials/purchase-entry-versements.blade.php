@php
    $paid = $entry->paidAmount();
    $remaining = $entry->remainingAmount();
@endphp

<style>
    @keyframes fi-versement-flash {
        0% { opacity: 0; transform: scale(0.96); }
        60% { opacity: 1; transform: scale(1.01); }
        100% { opacity: 1; transform: scale(1); }
    }

    .pe-versement-summary {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        animation: fi-versement-flash 0.4s ease-out;
    }

    @media (min-width: 640px) {
        .pe-versement-summary {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
    }

    .pe-versement-card {
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 0.5rem;
        padding: 0.75rem;
        text-align: center;
    }

    .pe-versement-card__label {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.03em;
        opacity: 0.65;
    }

    .pe-versement-card__value {
        margin-top: 0.25rem;
        font-size: 1rem;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .pe-versement-card--paid {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.08);
    }

    .pe-versement-card--paid .pe-versement-card__label,
    .pe-versement-card--paid .pe-versement-card__value {
        color: rgb(5, 150, 105);
        opacity: 1;
    }

    .pe-versement-card--remaining {
        border-color: rgba(245, 158, 11, 0.45);
        background: rgba(245, 158, 11, 0.08);
    }

    .pe-versement-card--remaining .pe-versement-card__label,
    .pe-versement-card--remaining .pe-versement-card__value {
        color: rgb(217, 119, 6);
        opacity: 1;
    }

    .pe-versement-table-wrap {
        margin-top: 1rem;
        overflow-x: auto;
    }

    .pe-versement-table {
        width: 100%;
        text-align: start;
        border-collapse: collapse;
    }

    .pe-versement-table th,
    .pe-versement-table td {
        padding: 0.5rem 0.75rem;
        text-align: start;
        font-size: 0.875rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    }

    .pe-versement-table th {
        font-weight: 600;
    }

    .pe-versement-empty {
        padding: 1rem 0;
        text-align: center;
        font-size: 0.875rem;
        opacity: 0.65;
    }

    .pe-versement-hint {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.625rem 0.875rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
    }

    .pe-versement-hint--partial {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.35);
        color: rgb(217, 119, 6);
    }

    .pe-versement-hint--full {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: rgb(5, 150, 105);
    }
</style>

<div class="pe-versement-summary">
    <div class="pe-versement-card">
        <div class="pe-versement-card__label">FOURNISSEUR</div>
        <div class="pe-versement-card__value">{{ $entry->fournisseur?->name ?? '—' }}</div>
    </div>
    <div class="pe-versement-card">
        <div class="pe-versement-card__label">TOTAL</div>
        <div class="pe-versement-card__value">{{ number_format($entry->total, 0, ',', ' ') }} DZD</div>
    </div>
    <div class="pe-versement-card pe-versement-card--paid">
        <div class="pe-versement-card__label">PAYÉ</div>
        <div class="pe-versement-card__value">{{ number_format($paid, 0, ',', ' ') }} DZD</div>
    </div>
    <div class="pe-versement-card pe-versement-card--remaining">
        <div class="pe-versement-card__label">RESTANT</div>
        <div class="pe-versement-card__value">{{ number_format($remaining, 0, ',', ' ') }} DZD</div>
    </div>
</div>

<div class="pe-versement-table-wrap">
    @if ($entry->versements->isEmpty())
        <p class="pe-versement-empty">Aucun versement pour le moment.</p>
    @else
        <table class="pe-versement-table">
            <thead>
                <tr>
                    <th>Ref</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Portefeuille</th>
                    <th>Remarque</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($entry->versements as $versement)
                    <tr>
                        <td>{{ $versement->reference }}</td>
                        <td>{{ $versement->date?->format('Y-m-d') }}</td>
                        <td style="font-weight: 600;">{{ number_format($versement->amount, 0, ',', ' ') }}</td>
                        <td>{{ $versement->wallet?->name ?? '—' }}</td>
                        <td>{{ $versement->remark ?: '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>
