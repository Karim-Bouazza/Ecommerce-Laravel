export type TagOption = {
  id: number
  name: string
}

export type Tag = {
  id: number
  name: string
  products_count: number
  has_related_data: boolean
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
