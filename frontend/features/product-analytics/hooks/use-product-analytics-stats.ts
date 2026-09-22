"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getProductAnalyticsStats,
  type GetProductAnalyticsStatsParams,
} from "@/features/product-analytics/api/product-analytics-api"

export function useProductAnalyticsStats(params: GetProductAnalyticsStatsParams) {
  return useQuery({
    queryKey: ["product-analytics-stats", params],
    queryFn: () => getProductAnalyticsStats(params),
    placeholderData: keepPreviousData,
  })
}
