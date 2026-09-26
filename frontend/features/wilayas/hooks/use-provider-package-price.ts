"use client"

import { useQuery } from "@tanstack/react-query"

import {
  calculateProviderPackagePrice,
  type CalculateProviderPackagePriceParams,
} from "@/features/wilayas/api/wilaya-api"

type UseProviderPackagePriceParams = CalculateProviderPackagePriceParams & {
  enabled: boolean
}

export function useProviderPackagePrice({ enabled, ...params }: UseProviderPackagePriceParams) {
  return useQuery({
    queryKey: ["provider-delivery-price", "calculate-package", params],
    queryFn: () => calculateProviderPackagePrice(params),
    enabled,
  })
}
