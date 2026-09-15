"use client"

import { useQuery } from "@tanstack/react-query"

import { getVersementStats } from "@/features/versements/api/versement-api"

export function useVersementStats() {
  return useQuery({
    queryKey: ["versement-stats"],
    queryFn: getVersementStats,
  })
}
