import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, WilayaAnalyticsItem } from "@/features/wilaya-analytics/types"

export type GetWilayaAnalyticsParams = {
  page?: number
  per_page?: number
  search?: string
  date_from?: string
  date_to?: string
  product_id?: number
  price_min?: number
  price_max?: number
}

export async function getWilayaAnalytics(
  params: GetWilayaAnalyticsParams
): Promise<PaginatedResponse<WilayaAnalyticsItem>> {
  try {
    const { data } = await api.get<PaginatedResponse<WilayaAnalyticsItem>>("/api/v1/wilayas/analytics", {
      params,
    })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
