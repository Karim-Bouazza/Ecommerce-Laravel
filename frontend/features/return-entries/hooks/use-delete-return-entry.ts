"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteReturnEntry } from "@/features/return-entries/api/return-entry-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteReturnEntry(returnEntryId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteReturnEntry(returnEntryId),
    onSuccess: () => {
      toast.success("Entrée de retour supprimée.")
      queryClient.invalidateQueries({ queryKey: ["return-entries"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
