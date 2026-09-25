export type PixelProvider = "facebook" | "tiktok" | "snapchat" | "google"

export type Pixel = {
  id: number
  name: string
  provider: PixelProvider
  pixel_id: string
  is_active: boolean
}

export type ActivePixel = {
  provider: PixelProvider
  pixel_id: string
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
