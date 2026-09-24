"use client"

import { useQuery } from "@tanstack/react-query"

import { getChargeVersements } from "@/features/charges/api/charge-api"

export function useChargeVersements(chargeId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["charges", chargeId, "versements"],
    queryFn: () => getChargeVersements(chargeId),
    enabled,
  })
}
