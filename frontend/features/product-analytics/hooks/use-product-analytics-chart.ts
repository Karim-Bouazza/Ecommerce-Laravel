"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getProductAnalyticsChart,
  type GetProductAnalyticsChartParams,
} from "@/features/product-analytics/api/product-analytics-api"

export function useProductAnalyticsChart(params: GetProductAnalyticsChartParams) {
  return useQuery({
    queryKey: ["product-analytics-chart", params],
    queryFn: () => getProductAnalyticsChart(params),
    placeholderData: keepPreviousData,
  })
}
