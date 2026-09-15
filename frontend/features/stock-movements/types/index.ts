export type StockMovementTypeValue = "in" | "out"
export type BadgeColor = "success" | "danger" | "info" | "warning"

export type StockMovement = {
  id: number
  product_name: string | null
  warehouse: { id: number; name: string }
  quantity: number
  signed_quantity: number
  resulting_quantity: number
  type: StockMovementTypeValue
  type_label: string
  type_color: BadgeColor
  creator_name: string | null
  created_at: string
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
