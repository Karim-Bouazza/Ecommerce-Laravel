"use client"

import { useQuery } from "@tanstack/react-query"

import { getChargeStats } from "@/features/charges/api/charge-api"

export function useChargeStats() {
  return useQuery({
    queryKey: ["charges", "stats"],
    queryFn: getChargeStats,
  })
}
