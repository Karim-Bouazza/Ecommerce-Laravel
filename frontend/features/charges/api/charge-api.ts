import { api, toApiError } from "@/lib/api"
import type { Charge, ChargeVersement, PaginatedResponse } from "@/features/charges/types"
import type { ChargeTypeValue } from "@/features/charges/constants/charge-types"
import type { ChargeOrderTriggerValue } from "@/features/charges/constants/charge-order-triggers"
import type { ChargeRecurrenceFrequencyValue } from "@/features/charges/constants/charge-recurrence-frequencies"

export type GetChargesParams = {
  tab?: "charges" | "recurring"
  page?: number
  per_page?: number
  search?: string
  date_from?: string
  date_to?: string
  product_id?: number
  type?: ChargeTypeValue
  category?: string
  payment_status?: "unpaid" | "partial" | "paid"
}

export async function getCharges(params: GetChargesParams): Promise<PaginatedResponse<Charge>> {
  try {
    const { data } = await api.get<PaginatedResponse<Charge>>("/api/v1/charges", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteCharge(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/charges/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export type ChargePayload = {
  category: string
  type: ChargeTypeValue
  order_trigger?: ChargeOrderTriggerValue | null
  recurrence_frequency?: ChargeRecurrenceFrequencyValue | null
  name: string
  amount: number
  starts_at?: string
  ends_at?: string
  all_products?: boolean
  product_ids?: number[]
}

export async function createCharge(payload: ChargePayload): Promise<Charge> {
  try {
    const { data } = await api.post<{ data: Charge }>("/api/v1/charges", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateCharge(id: number, payload: ChargePayload): Promise<Charge> {
  try {
    const { data } = await api.put<{ data: Charge }>(`/api/v1/charges/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export type ChargeVersementPayload = {
  date: string
  wallet_id: number
  amount: number
  remark?: string
}

export async function getChargeVersements(id: number): Promise<ChargeVersement[]> {
  try {
    const { data } = await api.get<{ data: ChargeVersement[] }>(`/api/v1/charges/${id}/versements`)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createChargeVersement(id: number, payload: ChargeVersementPayload): Promise<Charge> {
  try {
    const { data } = await api.post<{ data: Charge }>(`/api/v1/charges/${id}/versements`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export type ChargeStats = {
  total: number
  by_category: Record<string, number>
}

export async function getChargeStats(): Promise<ChargeStats> {
  try {
    const { data } = await api.get<ChargeStats>("/api/v1/charges/stats")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
