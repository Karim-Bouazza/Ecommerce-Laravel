import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Role, RoleDetail } from "@/features/roles/types"

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

export async function getRoleDetail(id: number): Promise<RoleDetail> {
  try {
    const { data } = await api.get<RoleDetail>(`/api/v1/roles/${id}`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteRole(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/roles/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
