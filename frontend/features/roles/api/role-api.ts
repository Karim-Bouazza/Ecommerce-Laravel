import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Role } from "@/features/roles/types"

export type GetRolesParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getRoles(params: GetRolesParams): Promise<PaginatedResponse<Role>> {
  try {
    const { data } = await api.get<PaginatedResponse<Role>>("/api/v1/roles", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
