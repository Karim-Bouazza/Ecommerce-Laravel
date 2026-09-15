"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getPaiements, type GetPaiementsParams } from "@/features/paiements/api/paiement-api"

export function usePaiements(params: GetPaiementsParams) {
  return useQuery({
    queryKey: ["paiements", params],
    queryFn: () => getPaiements(params),
    placeholderData: keepPreviousData,
  })
}
