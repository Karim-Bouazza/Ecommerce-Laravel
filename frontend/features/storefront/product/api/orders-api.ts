import { api, toApiError } from "@/lib/api"

export type CreateStorefrontOrderPayload = {
  first_name: string
  last_name: string
  phone_number: string
  wilaya_id: number
  provider_wilaya_id?: number
  provider_commune_id?: number
  delivery_type: "express" | "point_relais"
  delivery_price?: number
  items: {
    product_id: number
    variant?: string
    quantity: number
  }[]
}

export type CreateStorefrontOrderResponse = {
  id: number
  reference: string
}

export async function createStorefrontOrder(
  payload: CreateStorefrontOrderPayload
): Promise<CreateStorefrontOrderResponse> {
  try {
    const { data } = await api.post<CreateStorefrontOrderResponse>("/api/v1/orders", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
