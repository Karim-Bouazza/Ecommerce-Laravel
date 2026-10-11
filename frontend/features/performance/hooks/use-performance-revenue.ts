"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getPerformanceRevenue } from "@/features/performance/api/performance-api"
import type { PerformanceFilters } from "@/features/performance/types"

export function usePerformanceRevenue(filters: PerformanceFilters = {}) {
  return useQuery({
    queryKey: ["performance-revenue", filters],
    queryFn: () => getPerformanceRevenue(filters),
    placeholderData: keepPreviousData,
  })
}
