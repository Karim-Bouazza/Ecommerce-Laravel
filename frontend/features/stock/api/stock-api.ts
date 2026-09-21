import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, StockItem, StockStats } from "@/features/stock/types"

export type GetStockParams = {
  page?: number
  per_page?: number
  search?: string
  warehouse_id?: number
  purchase_price_min?: number
  purchase_price_max?: number
  stock_interne_min?: number
  stock_interne_max?: number
}

export async function getStock(params: GetStockParams): Promise<PaginatedResponse<StockItem>> {
  try {
    const { data } = await api.get<PaginatedResponse<StockItem>>("/api/v1/stock", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetStockStatsParams = Omit<GetStockParams, "page" | "per_page">

export async function getStockStats(params: GetStockStatsParams): Promise<StockStats> {
  try {
    const { data } = await api.get<StockStats>("/api/v1/stock/stats", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type AdjustStockPayload = {
  warehouse_id: number
  adjustment: number
  purchase_price: number
}

export async function adjustStock(productId: number, payload: AdjustStockPayload): Promise<StockItem> {
  try {
    const { data } = await api.post<{ data: StockItem }>(`/api/v1/stock/${productId}/adjust`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}
