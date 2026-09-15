import { api, toApiError } from "@/lib/api"

export type ProductStockOption = {
  id: number
  name: string
  quantity: number
  price: number
}

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
