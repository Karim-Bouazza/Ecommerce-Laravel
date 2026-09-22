"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getProductAnalytics,
  type GetProductAnalyticsParams,
} from "@/features/product-analytics/api/product-analytics-api"

export function useProductAnalytics(params: GetProductAnalyticsParams) {
  return useQuery({
    queryKey: ["product-analytics", params],
    queryFn: () => getProductAnalytics(params),
    placeholderData: keepPreviousData,
  })
}
