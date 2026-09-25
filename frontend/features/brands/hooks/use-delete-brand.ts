"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteBrand } from "@/features/brands/api/brand-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteBrand(brandId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteBrand(brandId),
    onSuccess: () => {
      toast.success("Marque supprimée.")
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
