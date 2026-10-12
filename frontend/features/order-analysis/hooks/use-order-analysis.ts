"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getOrderAnalysis } from "@/features/order-analysis/api/order-analysis-api"
import type { OrderAnalysisFilters } from "@/features/order-analysis/types"

export function useOrderAnalysis(filters: OrderAnalysisFilters = {}) {
  return useQuery({
    queryKey: ["order-analysis", "overview", filters],
    queryFn: () => getOrderAnalysis(filters),
    placeholderData: keepPreviousData,
  })
}
