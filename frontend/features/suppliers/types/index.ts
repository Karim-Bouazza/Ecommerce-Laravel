export type Supplier = {
  id: number
  name: string
  phone: string | null
  remark: string | null
  address: string | null
  total_dues: number
  total_paid: number
  remaining_amount: number
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
