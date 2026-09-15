export type Product = {
  id: number
  name: string
  description: string
  category_id: number | null
  category: string | null
  purchase_price: number | null
  price: number
  total_stock: number
  is_active: boolean
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
