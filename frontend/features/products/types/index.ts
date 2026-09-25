export type ProductTag = {
  id: number
  name: string
}

export type ProductSpec = {
  id: number
  label: string
  value: string
}

export type ProductVariant = {
  id: number
  label: string
}

export type Product = {
  id: number
  sku: string | null
  name: string
  description: string
  short_description: string | null
  category_id: number | null
  category: string | null
  brand_id: number | null
  brand: string | null
  tags: ProductTag[]
  specs: ProductSpec[]
  variants: ProductVariant[]
  purchase_price: number | null
  price: number
  total_stock: number
  is_active: boolean
  is_new: boolean
  image: string | null
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
