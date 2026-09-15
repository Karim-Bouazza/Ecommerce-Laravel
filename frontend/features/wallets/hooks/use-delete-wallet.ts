"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteWallet } from "@/features/wallets/api/wallet-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteWallet(walletId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteWallet(walletId),
    onSuccess: () => {
      toast.success("Portefeuille supprimé.")
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
