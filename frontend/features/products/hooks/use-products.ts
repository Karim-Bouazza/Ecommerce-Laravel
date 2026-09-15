"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getProducts, type GetProductsParams } from "@/features/products/api/product-api"

export function useProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  })
}
