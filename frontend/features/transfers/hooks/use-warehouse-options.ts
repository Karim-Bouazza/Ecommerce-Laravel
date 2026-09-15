"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouseOptions } from "@/features/transfers/api/warehouse-option-api"

export function useWarehouseOptions() {
  return useQuery({
    queryKey: ["transfers", "warehouse-options"],
    queryFn: getWarehouseOptions,
  })
}
