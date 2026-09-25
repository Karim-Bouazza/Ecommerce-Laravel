"use client"

import { useQuery } from "@tanstack/react-query"

import { getActivePixels } from "@/features/pixels/api/pixel-api"

export function useActivePixels() {
  return useQuery({
    queryKey: ["pixels", "active"],
    queryFn: getActivePixels,
    staleTime: 5 * 60 * 1000,
  })
}
