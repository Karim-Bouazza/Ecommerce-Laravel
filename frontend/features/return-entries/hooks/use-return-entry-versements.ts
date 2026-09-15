"use client"

import { useQuery } from "@tanstack/react-query"

import { getReturnEntryVersements } from "@/features/return-entries/api/return-entry-api"

export function useReturnEntryVersements(returnEntryId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["return-entries", returnEntryId, "versements"],
    queryFn: () => getReturnEntryVersements(returnEntryId),
    enabled,
  })
}
