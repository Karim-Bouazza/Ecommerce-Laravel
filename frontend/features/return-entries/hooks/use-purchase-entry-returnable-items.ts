"use client"

import { useQuery } from "@tanstack/react-query"

import { getPurchaseEntryReturnableItems } from "@/features/return-entries/api/return-entry-api"

export function usePurchaseEntryReturnableItems(purchaseEntryId: number | null, excludeReturnEntryId?: number) {
  return useQuery({
    queryKey: ["return-entries", "returnable-items", purchaseEntryId, excludeReturnEntryId],
    queryFn: () => getPurchaseEntryReturnableItems(purchaseEntryId as number, excludeReturnEntryId),
    enabled: !!purchaseEntryId,
  })
}
