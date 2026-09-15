import { api, toApiError } from "@/lib/api"

export type DeliveryCompanyOption = {
  id: number
  name: string
}

export async function getDeliveryCompanyOptions(): Promise<DeliveryCompanyOption[]> {
  try {
    const { data } = await api.get<{ data: DeliveryCompanyOption[] }>("/api/v1/delivery-companies")
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}
