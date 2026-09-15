"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { confirmTransfer } from "@/features/transfers/api/transfer-api"
import { getErrorMessage } from "@/lib/api"

export function useConfirmTransfer(transferId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => confirmTransfer(transferId),
    onSuccess: () => {
      toast.success("Transfert confirmé.")
      queryClient.invalidateQueries({ queryKey: ["transfers"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
