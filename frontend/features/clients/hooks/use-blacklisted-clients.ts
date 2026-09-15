"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getBlacklistedClients } from "@/features/clients/api/client-api"
import type { GetClientsParams } from "@/features/clients/api/client-api"

export function useBlacklistedClients(params: GetClientsParams) {
  return useQuery({
    queryKey: ["clients", "blacklist", params],
    queryFn: () => getBlacklistedClients(params),
    placeholderData: keepPreviousData,
  })
}
