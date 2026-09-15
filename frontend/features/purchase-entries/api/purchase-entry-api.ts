import { api, toApiError } from "@/lib/api"
import type {
  PaginatedResponse,
  PurchaseEntry,
  PurchaseEntryVersement,
} from "@/features/purchase-entries/types"

export type GetPurchaseEntriesParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getPurchaseEntries(
  params: GetPurchaseEntriesParams
): Promise<PaginatedResponse<PurchaseEntry>> {
  try {
    const { data } = await api.get<PaginatedResponse<PurchaseEntry>>("/api/v1/purchase-entries", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type PurchaseEntryItemPayload = {
  product_id: number
  quantity: number
  purchase_price: number
}

export type PurchaseEntryPayload = {
  warehouse_id: number
  fournisseur_id: number
  remark?: string
  items: PurchaseEntryItemPayload[]
}

export async function createPurchaseEntry(payload: PurchaseEntryPayload): Promise<PurchaseEntry> {
  try {
    const { data } = await api.post<PurchaseEntry>("/api/v1/purchase-entries", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updatePurchaseEntry(id: number, payload: PurchaseEntryPayload): Promise<PurchaseEntry> {
  try {
    const { data } = await api.put<PurchaseEntry>(`/api/v1/purchase-entries/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function confirmPurchaseEntry(id: number): Promise<PurchaseEntry> {
  try {
    const { data } = await api.post<PurchaseEntry>(`/api/v1/purchase-entries/${id}/confirm`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deletePurchaseEntry(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/purchase-entries/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export type PurchaseEntryVersementPayload = {
  date: string
  wallet_id: number
  amount: number
  remark?: string
}

export async function getPurchaseEntryVersements(id: number): Promise<PurchaseEntryVersement[]> {
  try {
    const { data } = await api.get<PurchaseEntryVersement[]>(`/api/v1/purchase-entries/${id}/versements`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createPurchaseEntryVersement(
  id: number,
  payload: PurchaseEntryVersementPayload
): Promise<PurchaseEntry> {
  try {
    const { data } = await api.post<PurchaseEntry>(`/api/v1/purchase-entries/${id}/versements`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
