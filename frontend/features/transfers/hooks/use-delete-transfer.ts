"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteTransfer } from "@/features/transfers/api/transfer-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteTransfer(transferId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteTransfer(transferId),
    onSuccess: () => {
      toast.success("Transfert supprimé.")
      queryClient.invalidateQueries({ queryKey: ["transfers"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
