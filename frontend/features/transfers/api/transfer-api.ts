import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Transfer } from "@/features/transfers/types"

export type GetTransfersParams = {
  page?: number
  per_page?: number
  search?: string
  warehouse_id?: number
}

export async function getTransfers(params: GetTransfersParams): Promise<PaginatedResponse<Transfer>> {
  try {
    const { data } = await api.get<PaginatedResponse<Transfer>>("/api/v1/transfers", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type TransferPayload = {
  from_warehouse_id: number
  to_warehouse_id: number
  remark?: string
  items: { product_id: number; quantity: number }[]
}

export async function createTransfer(payload: TransferPayload): Promise<Transfer> {
  try {
    const { data } = await api.post<{ data: Transfer }>("/api/v1/transfers", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function confirmTransfer(id: number): Promise<Transfer> {
  try {
    const { data } = await api.post<{ data: Transfer }>(`/api/v1/transfers/${id}/confirm`)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteTransfer(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/transfers/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
