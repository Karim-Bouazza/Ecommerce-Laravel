import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Paiement } from "@/features/paiements/types"

export type GetPaiementsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getPaiements(
  params: GetPaiementsParams
): Promise<PaginatedResponse<Paiement>> {
  try {
    const { data } = await api.get<PaginatedResponse<Paiement>>("/api/v1/paiements", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type PaiementPayload = {
  date: string
  wallet_id: number
  delivery_company_integration_id: number
  amount: number
  remark?: string
}

export async function createPaiement(payload: PaiementPayload): Promise<Paiement> {
  try {
    const { data } = await api.post<{ data: Paiement }>("/api/v1/paiements", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updatePaiement(id: number, payload: PaiementPayload): Promise<Paiement> {
  try {
    const { data } = await api.put<{ data: Paiement }>(`/api/v1/paiements/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deletePaiement(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/paiements/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
