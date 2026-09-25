"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteProductReview } from "@/features/product-reviews/api/product-review-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteProductReview(reviewId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteProductReview(reviewId),
    onSuccess: () => {
      toast.success("Avis supprimé.")
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
