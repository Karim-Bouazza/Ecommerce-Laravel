"use client"

import { useQuery } from "@tanstack/react-query"

import { getProviderHomeDeliveryPrice } from "@/features/wilayas/api/wilaya-api"

export function useProviderHomeDeliveryPrice(providerWilayaId: number | null) {
  return useQuery({
    queryKey: ["provider-delivery-price", "home", providerWilayaId],
    queryFn: () => getProviderHomeDeliveryPrice(providerWilayaId as number),
    enabled: providerWilayaId !== null,
    staleTime: Infinity,
  })
}
