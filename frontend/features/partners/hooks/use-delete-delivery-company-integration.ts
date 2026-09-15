"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteDeliveryCompanyIntegration } from "@/features/partners/api/partner-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteDeliveryCompanyIntegration(companyKey: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteDeliveryCompanyIntegration(companyKey),
    onSuccess: () => {
      toast.success("Intégration supprimée.")
      queryClient.invalidateQueries({ queryKey: ["delivery-company-integration", companyKey] })
      queryClient.invalidateQueries({ queryKey: ["delivery-company-integrations"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
