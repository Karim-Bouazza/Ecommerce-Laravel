"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deletePurchaseEntry } from "@/features/purchase-entries/api/purchase-entry-api"
import { getErrorMessage } from "@/lib/api"

export function useDeletePurchaseEntry(purchaseEntryId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePurchaseEntry(purchaseEntryId),
    onSuccess: () => {
      toast.success("Entrée d'achat supprimée.")
      queryClient.invalidateQueries({ queryKey: ["purchase-entries"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
