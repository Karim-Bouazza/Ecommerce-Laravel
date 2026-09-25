"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getBrands, type GetBrandsParams } from "@/features/brands/api/brand-api"

export function useBrandList(params: GetBrandsParams) {
  return useQuery({
    queryKey: ["brands", "list", params],
    queryFn: () => getBrands(params),
    placeholderData: keepPreviousData,
  })
}
