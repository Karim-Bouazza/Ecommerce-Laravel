"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getSalesEvolution } from "@/features/performance/api/performance-api"
import type { PerformanceFilters } from "@/features/performance/types"

export function useSalesEvolution(filters: PerformanceFilters = {}) {
  return useQuery({
    queryKey: ["performance-sales-evolution", filters],
    queryFn: () => getSalesEvolution(filters),
    placeholderData: keepPreviousData,
  })
}
