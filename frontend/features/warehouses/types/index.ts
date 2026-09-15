export type Warehouse = {
  id: number
  name: string
  phone: string | null
  address: string | null
  all_wilayas: boolean
  all_products: boolean
  wilaya_ids: number[]
  product_ids: number[]
  remark: string | null
  active: boolean
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
