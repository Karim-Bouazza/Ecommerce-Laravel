"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteVersement } from "@/features/versements/api/versement-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteVersement(versementId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteVersement(versementId),
    onSuccess: () => {
      toast.success("Versement supprimé.")
      queryClient.invalidateQueries({ queryKey: ["versements"] })
      queryClient.invalidateQueries({ queryKey: ["versement-stats"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
