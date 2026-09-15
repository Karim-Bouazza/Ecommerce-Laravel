"use client"

import { useQuery } from "@tanstack/react-query"

import { getDeliveryCompanyIntegrations } from "@/features/partners/api/partner-api"

export function useDeliveryCompanyIntegrations() {
  return useQuery({
    queryKey: ["delivery-company-integrations"],
    queryFn: getDeliveryCompanyIntegrations,
  })
}
