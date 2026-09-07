@if ($orders->isEmpty())
    <div class="fi-ta-empty-state flex flex-col items-center justify-center gap-y-2 py-8 text-center">
        <x-filament::icon
            icon="heroicon-o-shopping-bag"
            class="h-10 w-10 text-gray-400 dark:text-gray-500"
        />
        <p class="text-sm text-gray-500 dark:text-gray-400">
            Aucune commande pour ce client.
        </p>
    </div>
@else
    <div class="overflow-x-auto">
        <table class="fi-ta-table w-full text-start">
            <thead>
                <tr class="border-b border-gray-200 dark:border-white/10">
                    <th class="px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400">Référence</th>
                    <th class="px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400">Statut</th>
                    <th class="px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400">Paiement</th>
                    <th class="px-3 py-2 text-end text-xs font-medium text-gray-500 dark:text-gray-400">Total</th>
                    <th class="px-3 py-2 text-end text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                @foreach ($orders as $order)
                    <tr>
                        <td class="px-3 py-2 text-sm font-medium text-gray-950 dark:text-white">
                            {{ $order->reference }}
                        </td>
                        <td class="px-3 py-2">
                            <x-filament::badge :color="$order->status->color()">
                                {{ $order->status->label() }}
                            </x-filament::badge>
                        </td>
                        <td class="px-3 py-2">
                            <x-filament::badge :color="$order->payment_status->color()">
                                {{ $order->payment_status->label() }}
                            </x-filament::badge>
                        </td>
                        <td class="px-3 py-2 text-end text-sm text-gray-700 dark:text-gray-300">
                            {{ number_format($order->total_price, 0, ',', ' ') }} DZ
                        </td>
                        <td class="px-3 py-2 text-end text-sm text-gray-500 dark:text-gray-400">
                            {{ $order->created_at->format('d/m/Y') }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endif
