import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/api"
import { getFraudAssessment, getFraudAssessments, reviewFraudOrder } from "@/features/fraud/api/fraud-api"
import type { FraudFilters, ReviewPayload } from "@/features/fraud/types"

export function useFraudAssessments(filters: FraudFilters) {
  return useQuery({
    queryKey: ["fraud-assessments", filters],
    queryFn: () => getFraudAssessments(filters),
    placeholderData: keepPreviousData,
  })
}

export function useFraudAssessment(orderId: number | null) {
  return useQuery({
    queryKey: ["fraud-assessment", orderId],
    queryFn: () => getFraudAssessment(orderId as number),
    enabled: orderId !== null,
  })
}

export function useReviewFraudOrder(orderId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewFraudOrder(orderId, payload),
    onSuccess: () => {
      toast.success("Décision enregistrée.")
      // Scores of related orders may have changed too.
      queryClient.invalidateQueries({ queryKey: ["fraud-assessments"] })
      queryClient.invalidateQueries({ queryKey: ["fraud-assessment"] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
