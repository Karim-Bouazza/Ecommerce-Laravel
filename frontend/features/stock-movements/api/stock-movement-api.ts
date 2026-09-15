import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, StockMovement } from "@/features/stock-movements/types"

export type GetStockMovementsParams = {
  page?: number
  per_page?: number
  search?: string
  warehouse_id?: number
  product_id?: number
  type?: "in" | "out"
  date_from?: string
  date_to?: string
}

export async function getStockMovements(
  params: GetStockMovementsParams
): Promise<PaginatedResponse<StockMovement>> {
  try {
    const { data } = await api.get<PaginatedResponse<StockMovement>>("/api/v1/stock-movements", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
