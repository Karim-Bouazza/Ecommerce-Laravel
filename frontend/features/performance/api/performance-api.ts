import { api, toApiError } from "@/lib/api"
import type { PerformanceRevenueStats } from "@/features/performance/types"

export async function getPerformanceRevenue(): Promise<PerformanceRevenueStats> {
  try {
    const { data } = await api.get<PerformanceRevenueStats>("/api/v1/performance/revenue")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
