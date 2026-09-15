"use client"

import { useQuery } from "@tanstack/react-query"

import { getDeliveryCompanyIntegration } from "@/features/partners/api/partner-api"

export function useDeliveryCompanyIntegration(companyKey: string) {
  return useQuery({
    queryKey: ["delivery-company-integration", companyKey],
    queryFn: () => getDeliveryCompanyIntegration(companyKey),
  })
}
