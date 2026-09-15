"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouseProductOptions } from "@/features/transfers/api/product-option-api"

export function useWarehouseProductOptions(warehouseId: number | null) {
  return useQuery({
    queryKey: ["transfers", "product-options", warehouseId],
    queryFn: () => getWarehouseProductOptions(warehouseId as number),
    enabled: warehouseId !== null,
  })
}
