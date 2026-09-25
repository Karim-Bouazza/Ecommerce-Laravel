import { api, toApiError } from "@/lib/api"

export type StorefrontProduct = {
  id: number
  name: string
  category_id: number | null
  category: string | null
  price: number
  compare_price: number | null
  discount_percentage: number | null
  is_new: boolean
  in_stock: boolean
  image: string | null
}

export type StorefrontCategory = {
  id: number
  name: string
  products_count: number
}

export type StorefrontProductSpec = {
  label: string
  value: string
}

export type StorefrontProductVariant = {
  id: number
  label: string
}

export type StorefrontProductDetail = {
  id: number
  sku: string | null
  name: string
  description: string
  short_description: string | null
  category_id: number | null
  category: string | null
  brand: string | null
  tags: string[]
  specs: StorefrontProductSpec[]
  variants: StorefrontProductVariant[]
  price: number
  compare_price: number | null
  discount_percentage: number | null
  is_new: boolean
  in_stock: boolean
  stock: number
  rating_avg: number | null
  reviews_count: number
  images: string[]
}

export type StorefrontSort = "price_asc" | "price_desc" | "newest"

export type GetStorefrontProductsParams = {
  category_id?: string
  search?: string
  price_min?: number
  price_max?: number
  in_stock?: 0 | 1
  sort?: StorefrontSort
  page?: number
  per_page?: number
}

export type StorefrontProductsResponse = {
  data: StorefrontProduct[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  price_bounds: {
    min: number
    max: number
  }
}

export async function getStorefrontProducts(
  params: GetStorefrontProductsParams
): Promise<StorefrontProductsResponse> {
  try {
    const { data } = await api.get<StorefrontProductsResponse>("/api/v1/storefront/products", {
      params,
    })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getStorefrontProduct(id: number | string): Promise<StorefrontProductDetail> {
  try {
    const { data } = await api.get<StorefrontProductDetail>(`/api/v1/storefront/products/${id}`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getStorefrontCategories(): Promise<StorefrontCategory[]> {
  try {
    const { data } = await api.get<StorefrontCategory[]>("/api/v1/storefront/categories")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
