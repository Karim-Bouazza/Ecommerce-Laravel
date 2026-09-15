"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteProduct } from "@/features/products/api/product-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteProduct(productId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      toast.success("Produit supprimé.")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
