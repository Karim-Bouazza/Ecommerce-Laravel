"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getStockMovements, type GetStockMovementsParams } from "@/features/stock-movements/api/stock-movement-api"

export function useStockMovements(params: GetStockMovementsParams) {
  return useQuery({
    queryKey: ["stock-movements", params],
    queryFn: () => getStockMovements(params),
    placeholderData: keepPreviousData,
  })
}
