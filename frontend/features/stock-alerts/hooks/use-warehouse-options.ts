"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouseOptions } from "@/features/stock-alerts/api/warehouse-option-api"

export function useWarehouseOptions() {
  return useQuery({
    queryKey: ["stock-alerts", "warehouse-options"],
    queryFn: getWarehouseOptions,
  })
}
