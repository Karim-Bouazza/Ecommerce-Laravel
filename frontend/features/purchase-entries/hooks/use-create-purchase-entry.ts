"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createPurchaseEntry } from "@/features/purchase-entries/api/purchase-entry-api"
import {
  purchaseEntrySchema,
  type PurchaseEntrySchema,
} from "@/features/purchase-entries/schemas/purchase-entry-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreatePurchaseEntry(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<PurchaseEntrySchema>({
    resolver: zodResolver(purchaseEntrySchema),
    defaultValues: {
      warehouse_id: 0,
      fournisseur_id: 0,
      remark: "",
      items: [{ product_id: 0, quantity: 1, purchase_price: 0 }],
    },
  })

  const mutation = useMutation({
    mutationFn: createPurchaseEntry,
    onSuccess: () => {
      toast.success("Entrée d'achat créée.")
      queryClient.invalidateQueries({ queryKey: ["purchase-entries"] })
      form.reset()
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
