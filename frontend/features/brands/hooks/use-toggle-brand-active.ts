"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { toggleBrandActive } from "@/features/brands/api/brand-api"
import { getErrorMessage } from "@/lib/api"

export function useToggleBrandActive(brandId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleBrandActive(brandId),
    onSuccess: (brand) => {
      toast.success(brand.is_active ? "Marque activée." : "Marque désactivée.")
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
