"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { createPaiement } from "@/features/paiements/api/paiement-api"
import { paiementSchema, type PaiementSchema } from "@/features/paiements/schemas/paiement-schema"
import { getErrorMessage } from "@/lib/api"

const defaultValues: PaiementSchema = {
  date: new Date(),
  wallet_id: null,
  delivery_company_integration_id: null,
  amount: "",
  remark: "",
}

export function useCreatePaiement(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<PaiementSchema>({
    resolver: zodResolver(paiementSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: PaiementSchema) =>
      createPaiement({
        date: format(values.date, "yyyy-MM-dd"),
        wallet_id: values.wallet_id as number,
        delivery_company_integration_id: values.delivery_company_integration_id as number,
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Paiement créé.")
      queryClient.invalidateQueries({ queryKey: ["paiements"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      form.reset({ ...defaultValues, date: new Date() })
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
