"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { createVersement } from "@/features/versements/api/versement-api"
import { versementSchema, type VersementSchema } from "@/features/versements/schemas/versement-schema"
import { getErrorMessage } from "@/lib/api"

const defaultValues: VersementSchema = {
  date: new Date(),
  wallet_id: null,
  fournisseur_id: null,
  amount: "",
  remark: "",
}

export function useCreateVersement(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<VersementSchema>({
    resolver: zodResolver(versementSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: VersementSchema) =>
      createVersement({
        date: format(values.date, "yyyy-MM-dd"),
        wallet_id: values.wallet_id as number,
        fournisseur_id: values.fournisseur_id as number,
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Versement créé.")
      queryClient.invalidateQueries({ queryKey: ["versements"] })
      queryClient.invalidateQueries({ queryKey: ["versement-stats"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
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
