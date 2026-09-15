"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { confirmPurchaseEntry } from "@/features/purchase-entries/api/purchase-entry-api"
import { getErrorMessage } from "@/lib/api"

export function useConfirmPurchaseEntry(purchaseEntryId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => confirmPurchaseEntry(purchaseEntryId),
    onSuccess: () => {
      toast.success("Entrée d'achat confirmée.")
      queryClient.invalidateQueries({ queryKey: ["purchase-entries"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
