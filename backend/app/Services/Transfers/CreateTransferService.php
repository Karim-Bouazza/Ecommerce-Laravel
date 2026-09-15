<?php

namespace App\Services\Transfers;

use App\Models\WarehouseTransfer;
use Illuminate\Support\Facades\DB;

class CreateTransferService
{
    public function execute(array $data): WarehouseTransfer
    {
        return DB::transaction(function () use ($data): WarehouseTransfer {
            $items = $data['items'] ?? [];

            $transfer = WarehouseTransfer::create([
                'reference' => $this->generateReference(),
                'from_warehouse_id' => $data['from_warehouse_id'],
                'to_warehouse_id' => $data['to_warehouse_id'],
                'remark' => $data['remark'] ?? null,
            ]);

            foreach ($items as $item) {
                $transfer->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => (int) $item['quantity'],
                ]);
            }

            return $transfer;
        });
    }

    protected function generateReference(): string
    {
        $prefix = 'TR-'.now()->format('m-y').'-';

        $lastNumber = WarehouseTransfer::query()
            ->where('reference', 'like', $prefix.'%')
            ->lockForUpdate()
            ->get()
            ->map(fn (WarehouseTransfer $transfer) => (int) substr($transfer->reference, strlen($prefix)))
            ->max() ?? 0;

        return $prefix.str_pad((string) ($lastNumber + 1), 4, '0', STR_PAD_LEFT);
    }
}
