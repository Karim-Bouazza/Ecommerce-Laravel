import { api, toApiError } from "@/lib/api"
import type { ProductStockOption } from "@/features/transfers/types"

export async function getWarehouseProductOptions(warehouseId: number): Promise<ProductStockOption[]> {
  try {
    const { data } = await api.get<{ data: ProductStockOption[] }>(
      `/api/v1/warehouses/${warehouseId}/product-options`
    )
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}
