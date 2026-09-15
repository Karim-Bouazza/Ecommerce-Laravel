"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { updateVersement } from "@/features/versements/api/versement-api"
import { versementSchema, type VersementSchema } from "@/features/versements/schemas/versement-schema"
import type { Versement } from "@/features/versements/types"
import { getErrorMessage } from "@/lib/api"

export function versementToFormValues(versement: Versement): VersementSchema {
  return {
    date: new Date(versement.date),
    wallet_id: versement.wallet_id,
    fournisseur_id: versement.fournisseur_id,
    amount: String(versement.amount),
    remark: versement.remark ?? "",
  }
}

export function useUpdateVersement(versement: Versement, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<VersementSchema>({
    resolver: zodResolver(versementSchema),
    defaultValues: versementToFormValues(versement),
  })

  const mutation = useMutation({
    mutationFn: (values: VersementSchema) =>
      updateVersement(versement.id, {
        date: format(values.date, "yyyy-MM-dd"),
        wallet_id: values.wallet_id as number,
        fournisseur_id: values.fournisseur_id as number,
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Versement modifié.")
      queryClient.invalidateQueries({ queryKey: ["versements"] })
      queryClient.invalidateQueries({ queryKey: ["versement-stats"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
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
