"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteSupplier } from "@/features/suppliers/api/supplier-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteSupplier(supplierId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteSupplier(supplierId),
    onSuccess: () => {
      toast.success("Fournisseur supprimé.")
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
