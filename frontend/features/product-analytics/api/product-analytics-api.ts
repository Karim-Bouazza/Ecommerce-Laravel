import { api, toApiError } from "@/lib/api"
import type {
  PaginatedResponse,
  ProductAnalyticsChartItem,
  ProductAnalyticsItem,
  ProductAnalyticsStats,
} from "@/features/product-analytics/types"

export type GetProductAnalyticsParams = {
  page?: number
  per_page?: number
  search?: string
  date_from?: string
  date_to?: string
}

export async function getProductAnalytics(
  params: GetProductAnalyticsParams
): Promise<PaginatedResponse<ProductAnalyticsItem>> {
  try {
    const { data } = await api.get<PaginatedResponse<ProductAnalyticsItem>>(
      "/api/v1/products/analytics",
      { params }
    )
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetProductAnalyticsStatsParams = Omit<GetProductAnalyticsParams, "page" | "per_page">

export async function getProductAnalyticsStats(
  params: GetProductAnalyticsStatsParams
): Promise<ProductAnalyticsStats> {
  try {
    const { data } = await api.get<ProductAnalyticsStats>("/api/v1/products/analytics/stats", {
      params,
    })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetProductAnalyticsChartParams = GetProductAnalyticsStatsParams & {
  limit?: number
}

export async function getProductAnalyticsChart(
  params: GetProductAnalyticsChartParams
): Promise<ProductAnalyticsChartItem[]> {
  try {
    const { data } = await api.get<ProductAnalyticsChartItem[]>(
      "/api/v1/products/analytics/chart",
      { params }
    )
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
