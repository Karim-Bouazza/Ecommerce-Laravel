"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getSalesChannelChart } from "@/features/sales-channel-analysis/api/sales-channel-analysis-api"
import type { SalesChannelFilters } from "@/features/sales-channel-analysis/types"

export function useSalesChannelChart(filters: SalesChannelFilters = {}) {
  return useQuery({
    queryKey: ["sales-channel-analysis", "chart", filters],
    queryFn: () => getSalesChannelChart(filters),
    placeholderData: keepPreviousData,
  })
}
