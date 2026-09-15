"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getStock, type GetStockParams } from "@/features/stock/api/stock-api"

export function useStock(params: GetStockParams) {
  return useQuery({
    queryKey: ["stock", params],
    queryFn: () => getStock(params),
    placeholderData: keepPreviousData,
  })
}
