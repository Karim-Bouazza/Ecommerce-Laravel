import { api, toApiError } from "@/lib/api"
import type { SiteLogo } from "@/features/site-settings/types"

export async function getLogo(): Promise<SiteLogo> {
  try {
    const { data } = await api.get<SiteLogo>("/api/v1/site-settings/logo")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateLogo(file: Blob): Promise<SiteLogo> {
  try {
    const formData = new FormData()
    formData.append("logo", file, "logo.png")
    formData.append("_method", "PUT")
    const { data } = await api.post<SiteLogo>("/api/v1/site-settings/logo", formData)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
