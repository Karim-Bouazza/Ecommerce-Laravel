"use client"

import { useQuery } from "@tanstack/react-query"

import { getProviderCommunes } from "@/features/wilayas/api/wilaya-api"

export function useProviderCommunes(providerWilayaId: number | null) {
  return useQuery({
    queryKey: ["provider-communes", providerWilayaId],
    queryFn: () => getProviderCommunes(providerWilayaId as number),
    enabled: providerWilayaId !== null,
    staleTime: Infinity,
  })
}
