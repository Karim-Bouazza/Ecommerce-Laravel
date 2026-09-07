<div class="overflow-x-auto">
    <table class="w-full text-start">
        <thead>
            <tr class="border-b border-gray-200 dark:border-white/10">
                <th class="px-3 py-2 text-start text-sm font-semibold text-gray-950 dark:text-white">Nom du produit</th>
                <th class="px-3 py-2 text-start text-sm font-semibold text-gray-950 dark:text-white">Variante</th>
                <th class="px-3 py-2 text-start text-sm font-semibold text-gray-950 dark:text-white">Quantité</th>
                <th class="px-3 py-2 text-start text-sm font-semibold text-gray-950 dark:text-white">Prix d'achat (DZD)</th>
                <th class="px-3 py-2 text-start text-sm font-semibold text-gray-950 dark:text-white">Sous-total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($entry->items as $item)
                <tr class="border-b border-gray-100 dark:border-white/5">
                    <td class="px-3 py-2 text-sm text-gray-950 dark:text-white">{{ $item->product?->name ?? '—' }}</td>
                    <td class="px-3 py-2 text-sm text-gray-950 dark:text-white">{{ $item->variant ?: '—' }}</td>
                    <td class="px-3 py-2 text-sm text-gray-950 dark:text-white">{{ number_format($item->quantity, 0, ',', ' ') }}</td>
                    <td class="px-3 py-2 text-sm text-gray-950 dark:text-white">{{ number_format($item->purchase_price, 0, ',', ' ') }}</td>
                    <td class="px-3 py-2 text-sm text-gray-950 dark:text-white">{{ number_format($item->subtotal, 0, ',', ' ') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
