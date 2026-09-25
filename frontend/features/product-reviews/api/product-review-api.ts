import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, ProductReview } from "@/features/product-reviews/types"

export type GetProductReviewsParams = {
  page?: number
  per_page?: number
  status?: "pending" | "approved"
}

export async function getProductReviews(
  params: GetProductReviewsParams
): Promise<PaginatedResponse<ProductReview>> {
  try {
    const { data } = await api.get<PaginatedResponse<ProductReview>>("/api/v1/product-reviews", {
      params,
    })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateProductReviewStatus(
  id: number,
  is_approved: boolean
): Promise<ProductReview> {
  try {
    const { data } = await api.put<ProductReview>(`/api/v1/product-reviews/${id}`, { is_approved })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteProductReview(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/product-reviews/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
