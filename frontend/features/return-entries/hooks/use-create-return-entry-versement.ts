"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { createReturnEntryVersement } from "@/features/return-entries/api/return-entry-api"
import {
  returnEntryVersementSchema,
  type ReturnEntryVersementSchema,
} from "@/features/return-entries/schemas/return-entry-versement-schema"
import { getErrorMessage } from "@/lib/api"

/**
 * The amount is always the entry's full remaining balance — never taken from
 * form state — so a return payment can never be partial, regardless of what
 * the (read-only) amount field in the UI happens to render.
 */
export function useCreateReturnEntryVersement(returnEntryId: number, remainingAmount: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ReturnEntryVersementSchema>({
    resolver: zodResolver(returnEntryVersementSchema),
    defaultValues: {
      date: new Date(),
      wallet_id: null,
      remark: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: ReturnEntryVersementSchema) =>
      createReturnEntryVersement(returnEntryId, {
        date: format(values.date, "yyyy-MM-dd"),
        wallet_id: values.wallet_id as number,
        amount: remainingAmount,
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Paiement créé.")
      queryClient.invalidateQueries({ queryKey: ["return-entries"] })
      queryClient.invalidateQueries({ queryKey: ["return-entries", returnEntryId, "versements"] })
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
