"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getStockStats, type GetStockStatsParams } from "@/features/stock/api/stock-api"

export function useStockStats(params: GetStockStatsParams) {
  return useQuery({
    queryKey: ["stock-stats", params],
    queryFn: () => getStockStats(params),
    placeholderData: keepPreviousData,
  })
}
