"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { toggleClientBlacklist } from "@/features/clients/api/client-api"
import { getErrorMessage } from "@/lib/api"

export function useToggleClientBlacklist(clientId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleClientBlacklist(clientId),
    onSuccess: (client) => {
      toast.success(
        client.is_blacklisted ? "Client ajouté à la liste noire." : "Client retiré de la liste noire."
      )
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
