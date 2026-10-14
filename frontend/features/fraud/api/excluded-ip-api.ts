import { api, toApiError } from "@/lib/api"
import type { ExcludedIp, ExcludedIpPayload } from "@/features/fraud/types"

export async function getExcludedIps(): Promise<ExcludedIp[]> {
  try {
    const { data } = await api.get<ExcludedIp[]>("/api/v1/pixel-excluded-ips")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createExcludedIp(payload: ExcludedIpPayload): Promise<ExcludedIp> {
  try {
    const { data } = await api.post<ExcludedIp>("/api/v1/pixel-excluded-ips", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteExcludedIp(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/pixel-excluded-ips/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
