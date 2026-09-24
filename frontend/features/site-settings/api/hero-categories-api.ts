import { api, toApiError } from "@/lib/api"
import type { HeroCategory } from "@/features/site-settings/types"

export async function getHeroCategories(): Promise<HeroCategory[]> {
  try {
    const { data } = await api.get<HeroCategory[]>("/api/v1/site-settings/hero-categories")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createHeroCategory(payload: {
  category_id: number
  image: Blob
}): Promise<HeroCategory> {
  try {
    const formData = new FormData()
    formData.append("category_id", String(payload.category_id))
    formData.append("image", payload.image, "hero-category.png")
    const { data } = await api.post<HeroCategory>(
      "/api/v1/site-settings/hero-categories",
      formData
    )
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateHeroCategory(
  id: number,
  payload: { category_id?: number; image?: Blob; position?: number }
): Promise<HeroCategory> {
  try {
    const formData = new FormData()
    if (payload.category_id !== undefined) {
      formData.append("category_id", String(payload.category_id))
    }
    if (payload.image) {
      formData.append("image", payload.image, "hero-category.png")
    }
    if (payload.position !== undefined) {
      formData.append("position", String(payload.position))
    }
    formData.append("_method", "PUT")
    const { data } = await api.post<HeroCategory>(
      `/api/v1/site-settings/hero-categories/${id}`,
      formData
    )
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteHeroCategory(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/site-settings/hero-categories/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
