"use client"

import { useQuery } from "@tanstack/react-query"

import { getWilayaCommunes } from "@/features/wilayas/api/wilaya-api"

export function useWilayaCommunes(wilayaId: number | null) {
  return useQuery({
    queryKey: ["wilayas", wilayaId, "communes"],
    queryFn: () => getWilayaCommunes(wilayaId as number),
    enabled: wilayaId !== null,
    staleTime: Infinity,
  })
}
