"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { updatePaiement } from "@/features/paiements/api/paiement-api"
import { paiementSchema, type PaiementSchema } from "@/features/paiements/schemas/paiement-schema"
import type { Paiement } from "@/features/paiements/types"
import { getErrorMessage } from "@/lib/api"

export function paiementToFormValues(paiement: Paiement): PaiementSchema {
  return {
    date: new Date(paiement.date),
    wallet_id: paiement.wallet_id,
    delivery_company_integration_id: paiement.delivery_company_integration_id,
    amount: String(paiement.amount),
    remark: paiement.remark ?? "",
  }
}

export function useUpdatePaiement(paiement: Paiement, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<PaiementSchema>({
    resolver: zodResolver(paiementSchema),
    defaultValues: paiementToFormValues(paiement),
  })

  const mutation = useMutation({
    mutationFn: (values: PaiementSchema) =>
      updatePaiement(paiement.id, {
        date: format(values.date, "yyyy-MM-dd"),
        wallet_id: values.wallet_id as number,
        delivery_company_integration_id: values.delivery_company_integration_id as number,
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Paiement modifié.")
      queryClient.invalidateQueries({ queryKey: ["paiements"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
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
