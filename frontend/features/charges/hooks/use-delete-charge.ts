"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteCharge } from "@/features/charges/api/charge-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteCharge(chargeId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteCharge(chargeId),
    onSuccess: () => {
      toast.success("Charge supprimée.")
      queryClient.invalidateQueries({ queryKey: ["charges"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
