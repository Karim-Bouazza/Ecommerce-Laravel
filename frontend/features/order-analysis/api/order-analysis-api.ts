import { api, toApiError } from "@/lib/api"
import type {
  OrderAnalysis,
  OrderAnalysisFilters,
  OrderStatusBreakdown,
} from "@/features/order-analysis/types"

export async function getOrderAnalysis(params: OrderAnalysisFilters = {}): Promise<OrderAnalysis> {
  try {
    const { data } = await api.get<OrderAnalysis>("/api/v1/order-analysis", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getOrderStatusBreakdown(
  params: OrderAnalysisFilters = {}
): Promise<OrderStatusBreakdown> {
  try {
    const { data } = await api.get<OrderStatusBreakdown>("/api/v1/order-analysis/statuses", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
