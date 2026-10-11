import { api, toApiError } from "@/lib/api"
import type {
  PerformanceFilters,
  PerformanceRevenueStats,
  SalesEvolution,
} from "@/features/performance/types"

export async function getPerformanceRevenue(
  params: PerformanceFilters = {}
): Promise<PerformanceRevenueStats> {
  try {
    const { data } = await api.get<PerformanceRevenueStats>("/api/v1/performance/revenue", {
      params,
    })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getSalesEvolution(params: PerformanceFilters = {}): Promise<SalesEvolution> {
  try {
    const { data } = await api.get<SalesEvolution>("/api/v1/performance/sales-evolution", {
      params,
    })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
