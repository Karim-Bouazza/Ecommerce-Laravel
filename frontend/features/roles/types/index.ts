export type Role = {
  id: number
  name: string
  slug: string
  is_system: boolean
  permissions: string[]
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
