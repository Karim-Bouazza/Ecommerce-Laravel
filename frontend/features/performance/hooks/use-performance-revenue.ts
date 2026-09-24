"use client"

import { useQuery } from "@tanstack/react-query"

import { getPerformanceRevenue } from "@/features/performance/api/performance-api"

export function usePerformanceRevenue() {
  return useQuery({
    queryKey: ["performance-revenue"],
    queryFn: getPerformanceRevenue,
  })
}
