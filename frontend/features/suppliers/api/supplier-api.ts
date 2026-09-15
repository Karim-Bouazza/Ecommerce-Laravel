import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Supplier } from "@/features/suppliers/types"

export type GetSuppliersParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getSuppliers(
  params: GetSuppliersParams
): Promise<PaginatedResponse<Supplier>> {
  try {
    const { data } = await api.get<PaginatedResponse<Supplier>>("/api/v1/fournisseurs", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type SupplierPayload = {
  name: string
  phone?: string
  remark?: string
  address?: string
}

export async function createSupplier(payload: SupplierPayload): Promise<Supplier> {
  try {
    const { data } = await api.post<{ data: Supplier }>("/api/v1/fournisseurs", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateSupplier(id: number, payload: SupplierPayload): Promise<Supplier> {
  try {
    const { data } = await api.put<{ data: Supplier }>(`/api/v1/fournisseurs/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteSupplier(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/fournisseurs/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
