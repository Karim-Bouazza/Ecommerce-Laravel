import { api, toApiError } from "@/lib/api"
import type { Brand, BrandOption, PaginatedResponse } from "@/features/brands/types"

export async function getBrandOptions(): Promise<BrandOption[]> {
  try {
    const { data } = await api.get<BrandOption[]>("/api/v1/brand-options")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetBrandsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getBrands(params: GetBrandsParams): Promise<PaginatedResponse<Brand>> {
  try {
    const { data } = await api.get<PaginatedResponse<Brand>>("/api/v1/brands", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type BrandPayload = {
  name: string
  is_active: boolean
}

export async function createBrand(payload: BrandPayload): Promise<Brand> {
  try {
    const { data } = await api.post<Brand>("/api/v1/brands", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateBrand(id: number, payload: BrandPayload): Promise<Brand> {
  try {
    const { data } = await api.put<Brand>(`/api/v1/brands/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteBrand(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/brands/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function toggleBrandActive(id: number): Promise<Brand> {
  try {
    const { data } = await api.post<Brand>(`/api/v1/brands/${id}/toggle-active`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
