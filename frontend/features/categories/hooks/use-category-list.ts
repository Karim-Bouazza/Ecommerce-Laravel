"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getCategories, type GetCategoriesParams } from "@/features/categories/api/category-api"

export function useCategoryList(params: GetCategoriesParams) {
  return useQuery({
    queryKey: ["categories", "list", params],
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData,
  })
}
