"use client"

import { useQuery } from "@tanstack/react-query"

import { getProviderStopDesks } from "@/features/wilayas/api/wilaya-api"

export function useProviderStopDesks(providerWilayaId: number | null, providerCommuneId: number | null) {
  return useQuery({
    queryKey: ["provider-stopdesks", providerWilayaId, providerCommuneId],
    queryFn: () => getProviderStopDesks(providerWilayaId as number, providerCommuneId as number),
    enabled: providerWilayaId !== null && providerCommuneId !== null,
  })
}
