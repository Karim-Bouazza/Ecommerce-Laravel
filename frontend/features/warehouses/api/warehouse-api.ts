import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Warehouse } from "@/features/warehouses/types"

export type GetWarehousesParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getWarehouses(
  params: GetWarehousesParams
): Promise<PaginatedResponse<Warehouse>> {
  try {
    const { data } = await api.get<PaginatedResponse<Warehouse>>("/api/v1/warehouses", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type WarehousePayload = {
  name: string
  phone?: string
  remark?: string
  address?: string
  all_wilayas: boolean
  all_products: boolean
  wilaya_ids: number[]
  product_ids: number[]
}

export async function createWarehouse(payload: WarehousePayload): Promise<Warehouse> {
  try {
    const { data } = await api.post<{ data: Warehouse }>("/api/v1/warehouses", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateWarehouse(id: number, payload: WarehousePayload): Promise<Warehouse> {
  try {
    const { data } = await api.put<{ data: Warehouse }>(`/api/v1/warehouses/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteWarehouse(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/warehouses/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function toggleWarehouseActive(id: number): Promise<Warehouse> {
  try {
    const { data } = await api.post<{ data: Warehouse }>(`/api/v1/warehouses/${id}/toggle-active`)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}
