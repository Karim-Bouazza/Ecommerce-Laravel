"use client"

import { useQuery } from "@tanstack/react-query"

import { getProducts } from "@/features/products/api/product-api"

export function useProductOptions() {
  return useQuery({
    queryKey: ["products", "options"],
    queryFn: async () => {
      const { data: products } = await getProducts({ per_page: 100 })
      return products.map((product) => ({ id: product.id, name: product.name }))
    },
  })
}
