"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouseOptions } from "@/features/stock-movements/api/warehouse-option-api"

export function useWarehouseOptions() {
  return useQuery({
    queryKey: ["stock-movements", "warehouse-options"],
    queryFn: getWarehouseOptions,
  })
}
