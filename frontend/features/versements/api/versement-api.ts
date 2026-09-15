import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Versement, VersementStats } from "@/features/versements/types"

export async function getVersementStats(): Promise<VersementStats> {
  try {
    const { data } = await api.get<VersementStats>("/api/v1/versements/stats")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetVersementsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getVersements(
  params: GetVersementsParams
): Promise<PaginatedResponse<Versement>> {
  try {
    const { data } = await api.get<PaginatedResponse<Versement>>("/api/v1/versements", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type VersementPayload = {
  date: string
  wallet_id: number
  fournisseur_id: number
  amount: number
  remark?: string
}

export async function createVersement(payload: VersementPayload): Promise<Versement> {
  try {
    const { data } = await api.post<{ data: Versement }>("/api/v1/versements", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateVersement(id: number, payload: VersementPayload): Promise<Versement> {
  try {
    const { data } = await api.put<{ data: Versement }>(`/api/v1/versements/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteVersement(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/versements/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
