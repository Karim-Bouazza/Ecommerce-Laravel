"use client"

import { useQuery } from "@tanstack/react-query"

import { getCategories } from "@/features/categories/api/category-api"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  })
}
