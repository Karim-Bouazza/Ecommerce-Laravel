export type Client = {
  id: number
  first_name: string
  last_name: string
  full_name: string
  phone_number: string
  wilaya_id: number | null
  wilaya: string | null
  commune_id: number | null
  commune: string | null
  is_blacklisted: boolean
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
