export type TransferStatusValue = "pending" | "completed"
export type BadgeColor = "success" | "danger" | "info" | "warning"
export type TransferTypeValue = "in" | "out" | null

export type TransferItem = {
  id: number
  product_id: number
  product_name: string | null
  quantity: number
}

export type TransferWarehouse = {
  id: number
  name: string
}

export type Transfer = {
  id: number
  reference: string
  type: TransferTypeValue
  from_warehouse: TransferWarehouse
  to_warehouse: TransferWarehouse
  remark: string | null
  items: TransferItem[]
  status: TransferStatusValue
  status_label: string
  status_color: BadgeColor
  creator_name: string | null
  confirmed_at: string | null
  created_at: string
}

export type ProductStockOption = {
  id: number
  name: string
  quantity: number
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
