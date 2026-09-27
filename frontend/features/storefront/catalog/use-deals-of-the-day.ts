"use client"

import { useQuery } from "@tanstack/react-query"
import { getDealsOfTheDay } from "./api/products-api"

export function useDealsOfTheDay() {
  return useQuery({
    queryKey: ["storefront-deals"],
    queryFn: getDealsOfTheDay,
    staleTime: 5 * 60 * 1000,
  })
}
