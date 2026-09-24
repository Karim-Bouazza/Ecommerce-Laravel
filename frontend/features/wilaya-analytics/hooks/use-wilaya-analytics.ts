"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getWilayaAnalytics,
  type GetWilayaAnalyticsParams,
} from "@/features/wilaya-analytics/api/wilaya-analytics-api"

export function useWilayaAnalytics(params: GetWilayaAnalyticsParams) {
  return useQuery({
    queryKey: ["wilaya-analytics", params],
    queryFn: () => getWilayaAnalytics(params),
    placeholderData: keepPreviousData,
  })
}
