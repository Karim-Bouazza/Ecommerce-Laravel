import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, StockAlertItem } from "@/features/stock-alerts/types"

export type GetStockAlertsParams = {
  page?: number
  per_page?: number
  search?: string
  warehouse_id?: number
  purchase_price_min?: number
  purchase_price_max?: number
  stock_interne_min?: number
  stock_interne_max?: number
}

export async function getStockAlerts(
  params: GetStockAlertsParams
): Promise<PaginatedResponse<StockAlertItem>> {
  try {
    const { data } = await api.get<PaginatedResponse<StockAlertItem>>("/api/v1/stock-alerts", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
