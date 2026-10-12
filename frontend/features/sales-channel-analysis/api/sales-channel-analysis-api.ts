import { api, toApiError } from "@/lib/api"
import type {
  SalesChannel,
  SalesChannelChart,
  SalesChannelFilters,
} from "@/features/sales-channel-analysis/types"

export async function getSalesChannels(params: SalesChannelFilters = {}): Promise<SalesChannel[]> {
  try {
    const { data } = await api.get<{ data: SalesChannel[] }>("/api/v1/sales-channel-analysis", { params })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getSalesChannelChart(params: SalesChannelFilters = {}): Promise<SalesChannelChart> {
  try {
    const { data } = await api.get<SalesChannelChart>("/api/v1/sales-channel-analysis/chart", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
