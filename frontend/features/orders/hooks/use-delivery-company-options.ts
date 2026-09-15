"use client"

import { useQuery } from "@tanstack/react-query"

import { getDeliveryCompanyOptions } from "@/features/orders/api/delivery-company-option-api"

export function useDeliveryCompanyOptions() {
  return useQuery({
    queryKey: ["orders", "delivery-company-options"],
    queryFn: getDeliveryCompanyOptions,
  })
}
