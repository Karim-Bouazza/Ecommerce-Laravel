"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouseOptions } from "@/features/orders/api/warehouse-option-api"

export function useWarehouseOptions() {
  return useQuery({
    queryKey: ["orders", "warehouse-options"],
    queryFn: getWarehouseOptions,
  })
}
