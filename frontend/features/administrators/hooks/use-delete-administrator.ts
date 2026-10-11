"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteAdministrator } from "@/features/administrators/api/administrator-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteAdministrator(administratorId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteAdministrator(administratorId),
    onSuccess: () => {
      toast.success("Administrateur supprimé.")
      queryClient.invalidateQueries({ queryKey: ["administrators"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
