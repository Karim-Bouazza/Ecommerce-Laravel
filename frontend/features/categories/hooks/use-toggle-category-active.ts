"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { toggleCategoryActive } from "@/features/categories/api/category-api"
import { getErrorMessage } from "@/lib/api"

export function useToggleCategoryActive(categoryId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleCategoryActive(categoryId),
    onSuccess: (category) => {
      toast.success(category.is_active ? "Catégorie activée." : "Catégorie désactivée.")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
