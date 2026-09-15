"use client"

import { useQuery } from "@tanstack/react-query"

import { getWilayas } from "@/features/wilayas/api/wilaya-api"

export function useWilayas() {
  return useQuery({
    queryKey: ["wilayas"],
    queryFn: getWilayas,
    staleTime: Infinity,
  })
}
