export type ProductReview = {
  id: number
  product_id: number
  product_name: string | null
  customer_name: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string | null
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
