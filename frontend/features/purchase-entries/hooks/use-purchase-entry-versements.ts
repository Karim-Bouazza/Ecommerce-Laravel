"use client"

import { useQuery } from "@tanstack/react-query"

import { getPurchaseEntryVersements } from "@/features/purchase-entries/api/purchase-entry-api"

export function usePurchaseEntryVersements(purchaseEntryId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["purchase-entries", purchaseEntryId, "versements"],
    queryFn: () => getPurchaseEntryVersements(purchaseEntryId),
    enabled,
  })
}
