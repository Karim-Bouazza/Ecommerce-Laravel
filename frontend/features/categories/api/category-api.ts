import { api, toApiError } from "@/lib/api"
import type { Category, CategoryOption, PaginatedResponse } from "@/features/categories/types"

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  try {
    const { data } = await api.get<CategoryOption[]>("/api/v1/category-options")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetCategoriesParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getCategories(
  params: GetCategoriesParams
): Promise<PaginatedResponse<Category>> {
  try {
    const { data } = await api.get<PaginatedResponse<Category>>("/api/v1/categories", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type CategoryPayload = {
  name: string
  is_active: boolean
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  try {
    const { data } = await api.post<Category>("/api/v1/categories", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateCategory(id: number, payload: CategoryPayload): Promise<Category> {
  try {
    const { data } = await api.put<Category>(`/api/v1/categories/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/categories/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function toggleCategoryActive(id: number): Promise<Category> {
  try {
    const { data } = await api.post<Category>(`/api/v1/categories/${id}/toggle-active`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
