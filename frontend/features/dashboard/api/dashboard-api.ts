import { api, toApiError } from "@/lib/api"
import type { DashboardData, DashboardPeriod } from "@/features/dashboard/types"

export type GetDashboardParams = {
  period?: DashboardPeriod
  date_from?: string
  date_to?: string
  wilaya_id?: number
  product_id?: number
}

export async function getDashboard(params: GetDashboardParams): Promise<DashboardData> {
  try {
    const { data } = await api.get<DashboardData>("/api/v1/dashboard", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
