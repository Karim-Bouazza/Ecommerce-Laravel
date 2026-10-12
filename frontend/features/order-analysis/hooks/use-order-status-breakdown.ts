"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getOrderStatusBreakdown } from "@/features/order-analysis/api/order-analysis-api"
import type { OrderAnalysisFilters } from "@/features/order-analysis/types"

export function useOrderStatusBreakdown(filters: OrderAnalysisFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ["order-analysis", "statuses", filters],
    queryFn: () => getOrderStatusBreakdown(filters),
    placeholderData: keepPreviousData,
    enabled,
  })
}
