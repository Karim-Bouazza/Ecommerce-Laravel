import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Tag, TagOption } from "@/features/tags/types"

export async function getTagOptions(): Promise<TagOption[]> {
  try {
    const { data } = await api.get<TagOption[]>("/api/v1/tag-options")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetTagsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getTags(params: GetTagsParams): Promise<PaginatedResponse<Tag>> {
  try {
    const { data } = await api.get<PaginatedResponse<Tag>>("/api/v1/tags", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type TagPayload = {
  name: string
}

export async function createTag(payload: TagPayload): Promise<Tag> {
  try {
    const { data } = await api.post<Tag>("/api/v1/tags", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateTag(id: number, payload: TagPayload): Promise<Tag> {
  try {
    const { data } = await api.put<Tag>(`/api/v1/tags/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteTag(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/tags/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
