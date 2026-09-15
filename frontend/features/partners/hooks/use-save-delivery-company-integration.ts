"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { saveDeliveryCompanyIntegration } from "@/features/partners/api/partner-api"
import {
  deliveryCompanyIntegrationSchema,
  type DeliveryCompanyIntegrationSchema,
} from "@/features/partners/schemas/delivery-company-integration-schema"
import { getErrorMessage } from "@/lib/api"

export function useSaveDeliveryCompanyIntegration(companyKey: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<DeliveryCompanyIntegrationSchema>({
    resolver: zodResolver(deliveryCompanyIntegrationSchema),
    defaultValues: { name: "", api_token: "" },
  })

  const mutation = useMutation({
    mutationFn: (values: DeliveryCompanyIntegrationSchema) =>
      saveDeliveryCompanyIntegration(companyKey, values),
    onSuccess: () => {
      toast.success("Intégration enregistrée.")
      queryClient.invalidateQueries({ queryKey: ["delivery-company-integration", companyKey] })
      queryClient.invalidateQueries({ queryKey: ["delivery-company-integrations"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  }
}
