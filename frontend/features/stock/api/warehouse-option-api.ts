import { api, toApiError } from "@/lib/api"

export type WarehouseOption = {
  id: number
  name: string
}

export async function getWarehouseOptions(): Promise<WarehouseOption[]> {
  try {
    const { data } = await api.get<{ data: WarehouseOption[] }>("/api/v1/warehouse-options")
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}
