"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getPurchaseEntries, type GetPurchaseEntriesParams } from "@/features/purchase-entries/api/purchase-entry-api"

export function usePurchaseEntries(params: GetPurchaseEntriesParams) {
  return useQuery({
    queryKey: ["purchase-entries", params],
    queryFn: () => getPurchaseEntries(params),
    placeholderData: keepPreviousData,
  })
}
