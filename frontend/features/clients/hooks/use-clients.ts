"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getClients, type GetClientsParams } from "@/features/clients/api/client-api"

export function useClients(params: GetClientsParams) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => getClients(params),
    placeholderData: keepPreviousData,
  })
}
