"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { createChargeVersement } from "@/features/charges/api/charge-api"
import {
  chargeVersementSchema,
  type ChargeVersementSchema,
} from "@/features/charges/schemas/charge-versement-schema"
import { getErrorMessage } from "@/lib/api"

const defaultValues: ChargeVersementSchema = {
  date: new Date(),
  wallet_id: null,
  amount: "",
  remark: "",
}

export function useCreateChargeVersement(chargeId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ChargeVersementSchema>({
    resolver: zodResolver(chargeVersementSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: ChargeVersementSchema) =>
      createChargeVersement(chargeId, {
        date: format(values.date, "yyyy-MM-dd"),
        wallet_id: values.wallet_id as number,
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Versement créé.")
      queryClient.invalidateQueries({ queryKey: ["charges"] })
      queryClient.invalidateQueries({ queryKey: ["charges", chargeId, "versements"] })
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
