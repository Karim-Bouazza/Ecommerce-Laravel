import { api, toApiError } from "@/lib/api"
import type {
  FraudAssessmentDetail,
  FraudFilters,
  FraudPaginated,
  FraudReview,
  ReviewPayload,
} from "@/features/fraud/types"

export async function getFraudAssessments(params: FraudFilters): Promise<FraudPaginated> {
  try {
    const { data } = await api.get<FraudPaginated>("/api/v1/fraud/assessments", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getFraudAssessment(orderId: number): Promise<FraudAssessmentDetail> {
  try {
    const { data } = await api.get<FraudAssessmentDetail>(`/api/v1/fraud/assessments/${orderId}`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function reviewFraudOrder(orderId: number, payload: ReviewPayload): Promise<FraudReview> {
  try {
    const { data } = await api.post<FraudReview>(`/api/v1/fraud/assessments/${orderId}/review`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
