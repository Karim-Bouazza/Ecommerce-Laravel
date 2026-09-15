"use client"

import { useQuery } from "@tanstack/react-query"

import { getDeliveryCompanyIntegrations } from "@/features/partners/api/partner-api"

export function useDeliveryPartnerOptions() {
  return useQuery({
    queryKey: ["partners", "integrations", "options"],
    queryFn: async () => {
      const integrations = await getDeliveryCompanyIntegrations()
      return integrations.map((integration) => ({
        id: integration.id,
        name: integration.name ?? integration.entreprise,
      }))
    },
  })
}
