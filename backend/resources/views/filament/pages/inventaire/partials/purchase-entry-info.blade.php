@php
    $rows = [
        'Référence' => $entry->reference,
        'Date de création' => $entry->created_at?->format('Y-m-d H:i:s'),
        'Entrepôt' => $entry->warehouse?->name,
        'Fournisseur' => $entry->fournisseur?->name,
        'Total' => number_format($entry->total, 0, ',', ' ').' DZD',
        'Statut de paiement' => $entry->payment_status->label(),
        'Statut' => $entry->status->label(),
        'Remarque' => $entry->remark,
    ];
@endphp

<dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    @foreach ($rows as $label => $value)
        <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $label }}</dt>
            <dd class="text-sm text-gray-950 dark:text-white">{{ $value !== null && $value !== '' ? $value : '—' }}</dd>
        </div>
    @endforeach
</dl>
