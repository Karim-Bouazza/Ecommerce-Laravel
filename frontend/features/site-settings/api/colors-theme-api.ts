import { api, toApiError } from "@/lib/api"
import type { SiteColorsTheme } from "@/features/site-settings/types"

export async function getColorsTheme(): Promise<SiteColorsTheme> {
  try {
    const { data } = await api.get<SiteColorsTheme>("/api/v1/site-settings/colors-theme")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateColorsTheme(payload: SiteColorsTheme): Promise<SiteColorsTheme> {
  try {
    const { data } = await api.put<SiteColorsTheme>("/api/v1/site-settings/colors-theme", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
