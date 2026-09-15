"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updatePurchaseEntry } from "@/features/purchase-entries/api/purchase-entry-api"
import {
  purchaseEntrySchema,
  type PurchaseEntrySchema,
} from "@/features/purchase-entries/schemas/purchase-entry-schema"
import type { PurchaseEntry } from "@/features/purchase-entries/types"
import { getErrorMessage } from "@/lib/api"

export function purchaseEntryToFormValues(entry: PurchaseEntry): PurchaseEntrySchema {
  return {
    warehouse_id: entry.warehouse.id,
    fournisseur_id: entry.fournisseur.id,
    remark: entry.remark ?? "",
    items: entry.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      purchase_price: item.purchase_price,
    })),
  }
}

export function useUpdatePurchaseEntry(entry: PurchaseEntry, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<PurchaseEntrySchema>({
    resolver: zodResolver(purchaseEntrySchema),
    defaultValues: purchaseEntryToFormValues(entry),
  })

  const mutation = useMutation({
    mutationFn: (values: PurchaseEntrySchema) => updatePurchaseEntry(entry.id, values),
    onSuccess: () => {
      toast.success("Entrée d'achat modifiée.")
      queryClient.invalidateQueries({ queryKey: ["purchase-entries"] })
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
