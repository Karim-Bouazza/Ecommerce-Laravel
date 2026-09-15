"use client"

import { useQuery } from "@tanstack/react-query"

import { getPurchaseEntryOptions } from "@/features/return-entries/api/return-entry-api"

export function usePurchaseEntryOptions() {
  return useQuery({
    queryKey: ["return-entries", "purchase-entry-options"],
    queryFn: getPurchaseEntryOptions,
  })
}
