"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { createPurchaseEntryVersement } from "@/features/purchase-entries/api/purchase-entry-api"
import {
  purchaseEntryVersementSchema,
  type PurchaseEntryVersementSchema,
} from "@/features/purchase-entries/schemas/purchase-entry-versement-schema"
import { getErrorMessage } from "@/lib/api"

const defaultValues: PurchaseEntryVersementSchema = {
  date: new Date(),
  wallet_id: null,
  amount: "",
  remark: "",
}

export function useCreatePurchaseEntryVersement(purchaseEntryId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<PurchaseEntryVersementSchema>({
    resolver: zodResolver(purchaseEntryVersementSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: PurchaseEntryVersementSchema) =>
      createPurchaseEntryVersement(purchaseEntryId, {
        date: format(values.date, "yyyy-MM-dd"),
        wallet_id: values.wallet_id as number,
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Versement créé.")
      queryClient.invalidateQueries({ queryKey: ["purchase-entries"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-entries", purchaseEntryId, "versements"] })
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
