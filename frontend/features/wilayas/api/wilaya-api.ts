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

export async function updateWilayaStopDeskPrice(id: number, price_stop_desk: number): Promise<Wilaya> {
  try {
    const { data } = await api.put<Wilaya>(`/api/v1/wilayas/${id}`, { price_stop_desk })
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

export type ProviderStopDesk = {
  office_id: string
  name: string
  address: string | null
  price: number
}

export async function getProviderStopDesks(
  providerWilayaId: number,
  providerCommuneId: number
): Promise<ProviderStopDesk[]> {
  try {
    const { data } = await api.get<{ data: ProviderStopDesk[] }>("/api/v1/provider-stopdesks", {
      params: { provider_wilaya_id: providerWilayaId, provider_commune_id: providerCommuneId },
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getProviderHomeDeliveryPrice(providerWilayaId: number): Promise<number | null> {
  try {
    const { data } = await api.get<{ price: number | null }>("/api/v1/provider-delivery-price/home", {
      params: { provider_wilaya_id: providerWilayaId },
    })
    return data.price
  } catch (error) {
    throw toApiError(error)
  }
}

export type ProviderPackagePrice = {
  insurance_value: number
  extra_weight_price: number
  delivery_price: number
  total_price: number
  price_to_pay: number
}

export type CalculateProviderPackagePriceParams = {
  price: number
  provider_wilaya_id: number
  provider_commune_id: number | null
  delivery_type: "express" | "point_relais"
  provider_office_id: string | null
  free_delivery: boolean
  can_be_opened: boolean
}

export async function calculateProviderPackagePrice(
  params: CalculateProviderPackagePriceParams
): Promise<ProviderPackagePrice> {
  try {
    const { data } = await api.post<ProviderPackagePrice>(
      "/api/v1/provider-delivery-price/calculate-package",
      params
    )
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
