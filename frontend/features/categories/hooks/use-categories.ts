"use client"

import { useQuery } from "@tanstack/react-query"

import { getCategoryOptions } from "@/features/categories/api/category-api"

export function useCategories() {
  return useQuery({
    queryKey: ["categories", "options"],
    queryFn: getCategoryOptions,
    staleTime: Infinity,
  })
}
