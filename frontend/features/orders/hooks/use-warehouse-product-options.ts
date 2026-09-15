"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouseProductOptions } from "@/features/orders/api/product-option-api"

export function useWarehouseProductOptions(warehouseId: number | null) {
  return useQuery({
    queryKey: ["orders", "product-options", warehouseId],
    queryFn: () => getWarehouseProductOptions(warehouseId as number),
    enabled: warehouseId !== null,
  })
}
