"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getReturnEntries, type GetReturnEntriesParams } from "@/features/return-entries/api/return-entry-api"

export function useReturnEntries(params: GetReturnEntriesParams) {
  return useQuery({
    queryKey: ["return-entries", params],
    queryFn: () => getReturnEntries(params),
    placeholderData: keepPreviousData,
  })
}
