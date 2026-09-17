import { api, toApiError } from "@/lib/api"
import type { Commune, Wilaya } from "@/features/wilayas/types"

export async function getWilayas(): Promise<Wilaya[]> {
  try {
    const { data } = await api.get<Wilaya[]>("/api/v1/wilayas")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getWilayaCommunes(wilayaId: number): Promise<Commune[]> {
  try {
    const { data } = await api.get<Wilaya & { communes: Commune[] }>(`/api/v1/wilayas/${wilayaId}`)
    return data.communes
  } catch (error) {
    throw toApiError(error)
  }
}

export type ProviderWilaya = {
  id: number
  name: string
  wilaya_id: number | null
}

export async function getProviderWilayas(): Promise<ProviderWilaya[]> {
  try {
    const { data } = await api.get<{ data: ProviderWilaya[] }>("/api/v1/provider-wilayas")
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export type ProviderCommune = {
  id: number
  name: string
}

export async function getProviderCommunes(providerWilayaId: number): Promise<ProviderCommune[]> {
  try {
    const { data } = await api.get<{ data: ProviderCommune[] }>("/api/v1/provider-communes", {
      params: { provider_wilaya_id: providerWilayaId },
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}
