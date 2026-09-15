"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouseOptions } from "@/features/stock/api/warehouse-option-api"

export function useWarehouseOptions() {
  return useQuery({
    queryKey: ["stock", "warehouse-options"],
    queryFn: getWarehouseOptions,
  })
}
