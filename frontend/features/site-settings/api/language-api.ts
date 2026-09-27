import { api, toApiError } from "@/lib/api"
import type { SiteLanguageSetting } from "@/features/site-settings/types"

export async function getSiteLanguage(): Promise<SiteLanguageSetting> {
  try {
    const { data } = await api.get<SiteLanguageSetting>("/api/v1/site-settings/language")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateSiteLanguage(language: SiteLanguageSetting["language"]): Promise<SiteLanguageSetting> {
  try {
    const { data } = await api.put<SiteLanguageSetting>("/api/v1/site-settings/language", { language })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
