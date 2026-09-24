"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteCategory } from "@/features/categories/api/category-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteCategory(categoryId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteCategory(categoryId),
    onSuccess: () => {
      toast.success("Catégorie supprimée.")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
