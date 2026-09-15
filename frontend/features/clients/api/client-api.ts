import { api, toApiError } from "@/lib/api"
import type { UpdateClientSchema } from "@/features/clients/schemas/update-client-schema"
import type { Client, PaginatedResponse } from "@/features/clients/types"

export type GetClientsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getClients(params: GetClientsParams): Promise<PaginatedResponse<Client>> {
  try {
    const { data } = await api.get<PaginatedResponse<Client>>("/api/v1/clients", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getBlacklistedClients(params: GetClientsParams): Promise<PaginatedResponse<Client>> {
  try {
    const { data } = await api.get<PaginatedResponse<Client>>("/api/v1/clients/blacklist", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateClient(id: number, payload: UpdateClientSchema): Promise<Client> {
  try {
    const { data } = await api.put<Client>(`/api/v1/clients/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function toggleClientBlacklist(id: number): Promise<Client> {
  try {
    const { data } = await api.post<Client>(`/api/v1/clients/${id}/toggle-blacklist`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteClient(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/clients/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
