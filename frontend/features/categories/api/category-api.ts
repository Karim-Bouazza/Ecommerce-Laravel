import { api, toApiError } from "@/lib/api"
import type { Category } from "@/features/categories/types"

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get<Category[]>("/api/v1/categories")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
