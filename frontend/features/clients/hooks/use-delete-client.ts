"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteClient } from "@/features/clients/api/client-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteClient(clientId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteClient(clientId),
    onSuccess: () => {
      toast.success("Client supprimé.")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
