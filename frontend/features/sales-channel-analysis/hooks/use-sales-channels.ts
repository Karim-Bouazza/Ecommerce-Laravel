"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getSalesChannels } from "@/features/sales-channel-analysis/api/sales-channel-analysis-api"
import type { SalesChannelFilters } from "@/features/sales-channel-analysis/types"

export function useSalesChannels(filters: SalesChannelFilters = {}) {
  return useQuery({
    queryKey: ["sales-channel-analysis", "channels", filters],
    queryFn: () => getSalesChannels(filters),
    placeholderData: keepPreviousData,
  })
}
