import { api, toApiError } from "@/lib/api"
import type { ActivePixel, PaginatedResponse, Pixel, PixelProvider } from "@/features/pixels/types"

export async function getActivePixels(): Promise<ActivePixel[]> {
  try {
    const { data } = await api.get<ActivePixel[]>("/api/v1/pixels/active")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetPixelsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getPixels(params: GetPixelsParams): Promise<PaginatedResponse<Pixel>> {
  try {
    const { data } = await api.get<PaginatedResponse<Pixel>>("/api/v1/pixels", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type PixelPayload = {
  name: string
  provider: PixelProvider
  pixel_id: string
  is_active: boolean
}

export async function createPixel(payload: PixelPayload): Promise<Pixel> {
  try {
    const { data } = await api.post<Pixel>("/api/v1/pixels", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updatePixel(id: number, payload: PixelPayload): Promise<Pixel> {
  try {
    const { data } = await api.put<Pixel>(`/api/v1/pixels/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deletePixel(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/pixels/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function togglePixelActive(id: number): Promise<Pixel> {
  try {
    const { data } = await api.post<Pixel>(`/api/v1/pixels/${id}/toggle-active`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
