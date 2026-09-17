"use client"

import { useQuery } from "@tanstack/react-query"

import { getProviderWilayas } from "@/features/wilayas/api/wilaya-api"

export function useProviderWilayas() {
  return useQuery({
    queryKey: ["provider-wilayas"],
    queryFn: getProviderWilayas,
    staleTime: Infinity,
  })
}
