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
