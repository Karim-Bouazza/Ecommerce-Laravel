import { api, toApiError } from "@/lib/api"
import type {
  SectionProduct,
  StorefrontFeature,
  StorefrontPromoBanner,
  StorefrontSection,
} from "@/features/site-settings/types"

async function request<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await promise
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

function toFormData(values: Record<string, string | boolean | Blob | null | undefined>, method?: "PUT") {
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue
    if (value instanceof Blob) formData.append(key, value)
    else if (typeof value === "boolean") formData.append(key, value ? "1" : "0")
    else formData.append(key, value ?? "")
  }
  if (method) formData.append("_method", method)
  return formData
}

/* ---------- Section products (Meilleures offres, Nouveautés, Votre style) ---------- */

const sectionUrl = (section: StorefrontSection) => `/api/v1/site-settings/sections/${section}/products`

export const getStorefrontSectionProducts = (section: StorefrontSection) =>
  request(api.get<SectionProduct[]>(`/api/v1/storefront/sections/${section}/products`))

export const getSectionProducts = (section: StorefrontSection) =>
  request(api.get<SectionProduct[]>(sectionUrl(section)))

export const addSectionProduct = (
  section: StorefrontSection,
  payload: { product_id: number; label: string | null }
) => request(api.post<SectionProduct>(sectionUrl(section), payload))

export const updateSectionProductLabel = (section: StorefrontSection, id: number, label: string | null) =>
  request(api.put<SectionProduct>(`${sectionUrl(section)}/${id}`, { label }))

export const reorderSectionProducts = (section: StorefrontSection, ids: number[]) =>
  request(api.put<SectionProduct[]>(`${sectionUrl(section)}/order`, { ids }))

export const removeSectionProduct = (section: StorefrontSection, id: number) =>
  request(api.delete<void>(`${sectionUrl(section)}/${id}`))

/* ---------- Nos Atouts ---------- */

export type FeaturePayload = { title: string; description: string | null; image?: Blob }

export const getStorefrontFeatures = () =>
  request(api.get<StorefrontFeature[]>("/api/v1/storefront/features"))

export const createFeature = (payload: FeaturePayload) =>
  request(api.post<StorefrontFeature>("/api/v1/site-settings/features", toFormData(payload)))

export const updateFeature = (id: number, payload: FeaturePayload) =>
  request(api.post<StorefrontFeature>(`/api/v1/site-settings/features/${id}`, toFormData(payload, "PUT")))

export const reorderFeatures = (ids: number[]) =>
  request(api.put<StorefrontFeature[]>("/api/v1/site-settings/features/order", { ids }))

export const deleteFeature = (id: number) =>
  request(api.delete<void>(`/api/v1/site-settings/features/${id}`))

/* ---------- Bannières promotionnelles ---------- */

export type PromoBannerPayload = {
  eyebrow: string | null
  title: string
  description: string | null
  button_label: string
  link_url: string | null
  highlight: boolean
  image?: Blob
}

export const getStorefrontPromoBanners = () =>
  request(api.get<StorefrontPromoBanner[]>("/api/v1/storefront/promo-banners"))

export const createPromoBanner = (payload: PromoBannerPayload) =>
  request(api.post<StorefrontPromoBanner>("/api/v1/site-settings/promo-banners", toFormData(payload)))

export const updatePromoBanner = (id: number, payload: PromoBannerPayload) =>
  request(
    api.post<StorefrontPromoBanner>(`/api/v1/site-settings/promo-banners/${id}`, toFormData(payload, "PUT"))
  )

export const reorderPromoBanners = (ids: number[]) =>
  request(api.put<StorefrontPromoBanner[]>("/api/v1/site-settings/promo-banners/order", { ids }))

export const deletePromoBanner = (id: number) =>
  request(api.delete<void>(`/api/v1/site-settings/promo-banners/${id}`))
