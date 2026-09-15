export type ReturnEntryStatusValue = "pending" | "completed"
export type ReturnEntryPaymentStatusValue = "unpaid" | "paid"
export type BadgeColor = "success" | "danger" | "info" | "warning"

export type ReturnEntryItem = {
  id: number
  purchase_entry_item_id: number
  product_id: number
  product_name: string | null
  quantity: number
  purchase_price: number
  subtotal: number
}

export type ReturnEntry = {
  id: number
  reference: string
  purchase_entry: { id: number; reference: string }
  warehouse: { id: number; name: string }
  fournisseur: { id: number; name: string }
  remark: string | null
  items: ReturnEntryItem[]
  total: number
  status: ReturnEntryStatusValue
  status_label: string
  status_color: BadgeColor
  payment_status: ReturnEntryPaymentStatusValue
  payment_status_label: string
  payment_status_color: BadgeColor
  paid_amount: number
  remaining_amount: number
  created_at: string
}

export type ReturnEntryVersement = {
  id: number
  reference: string
  date: string
  amount: number
  wallet_id: number
  wallet_name: string | null
  remark: string | null
}

export type ReturnableItem = {
  id: number
  product_id: number
  product_name: string | null
  purchase_price: number
  purchased_quantity: number
  returned_quantity: number
  remaining_quantity: number
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
