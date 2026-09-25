"use client"

import { useQuery } from "@tanstack/react-query"

import { getBrandOptions } from "@/features/brands/api/brand-api"

export function useBrands() {
  return useQuery({
    queryKey: ["brands", "options"],
    queryFn: getBrandOptions,
    staleTime: Infinity,
  })
}
