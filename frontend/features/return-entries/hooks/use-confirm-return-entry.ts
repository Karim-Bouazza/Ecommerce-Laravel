"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { confirmReturnEntry } from "@/features/return-entries/api/return-entry-api"
import { getErrorMessage } from "@/lib/api"

export function useConfirmReturnEntry(returnEntryId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => confirmReturnEntry(returnEntryId),
    onSuccess: () => {
      toast.success("Entrée de retour confirmée.")
      queryClient.invalidateQueries({ queryKey: ["return-entries"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
