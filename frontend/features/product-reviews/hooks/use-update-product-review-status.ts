"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateProductReviewStatus } from "@/features/product-reviews/api/product-review-api"
import { getErrorMessage } from "@/lib/api"

export function useUpdateProductReviewStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, is_approved }: { id: number; is_approved: boolean }) =>
      updateProductReviewStatus(id, is_approved),
    onSuccess: (review) => {
      toast.success(review.is_approved ? "Avis approuvé." : "Avis rejeté.")
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
