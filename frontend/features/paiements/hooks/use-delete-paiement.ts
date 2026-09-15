"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deletePaiement } from "@/features/paiements/api/paiement-api"
import { getErrorMessage } from "@/lib/api"

export function useDeletePaiement(paiementId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePaiement(paiementId),
    onSuccess: () => {
      toast.success("Paiement supprimé.")
      queryClient.invalidateQueries({ queryKey: ["paiements"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
