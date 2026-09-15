import { api, toApiError } from "@/lib/api"
import type {
  PaginatedResponse,
  ReturnableItem,
  ReturnEntry,
  ReturnEntryVersement,
} from "@/features/return-entries/types"

export type GetReturnEntriesParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getReturnEntries(
  params: GetReturnEntriesParams
): Promise<PaginatedResponse<ReturnEntry>> {
  try {
    const { data } = await api.get<PaginatedResponse<ReturnEntry>>("/api/v1/return-entries", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type ReturnEntryItemPayload = {
  purchase_entry_item_id: number
  quantity: number
}

export type CreateReturnEntryPayload = {
  purchase_entry_id: number
  remark?: string
  items: ReturnEntryItemPayload[]
}

export type UpdateReturnEntryPayload = {
  remark?: string
  items: ReturnEntryItemPayload[]
}

export async function createReturnEntry(payload: CreateReturnEntryPayload): Promise<ReturnEntry> {
  try {
    const { data } = await api.post<ReturnEntry>("/api/v1/return-entries", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateReturnEntry(id: number, payload: UpdateReturnEntryPayload): Promise<ReturnEntry> {
  try {
    const { data } = await api.put<ReturnEntry>(`/api/v1/return-entries/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function confirmReturnEntry(id: number): Promise<ReturnEntry> {
  try {
    const { data } = await api.post<ReturnEntry>(`/api/v1/return-entries/${id}/confirm`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteReturnEntry(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/return-entries/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export type ReturnEntryVersementPayload = {
  date: string
  wallet_id: number
  amount: number
  remark?: string
}

export async function getReturnEntryVersements(id: number): Promise<ReturnEntryVersement[]> {
  try {
    const { data } = await api.get<ReturnEntryVersement[]>(`/api/v1/return-entries/${id}/versements`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createReturnEntryVersement(
  id: number,
  payload: ReturnEntryVersementPayload
): Promise<ReturnEntry> {
  try {
    const { data } = await api.post<ReturnEntry>(`/api/v1/return-entries/${id}/versements`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type PurchaseEntryOption = {
  id: number
  name: string
  warehouse_name: string | null
  fournisseur_name: string | null
}

export async function getPurchaseEntryOptions(): Promise<PurchaseEntryOption[]> {
  try {
    const { data } = await api.get<PurchaseEntryOption[]>("/api/v1/return-entries/purchase-entry-options")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getPurchaseEntryReturnableItems(
  purchaseEntryId: number,
  excludeReturnEntryId?: number
): Promise<ReturnableItem[]> {
  try {
    const { data } = await api.get<ReturnableItem[]>(
      `/api/v1/return-entries/purchase-entries/${purchaseEntryId}/items`,
      { params: excludeReturnEntryId ? { exclude_return_entry_id: excludeReturnEntryId } : undefined }
    )
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
