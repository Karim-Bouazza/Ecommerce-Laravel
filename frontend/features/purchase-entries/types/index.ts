export type PurchaseEntryStatusValue = "pending" | "completed"
export type PurchaseEntryPaymentStatusValue = "unpaid" | "partial" | "paid"
export type BadgeColor = "success" | "danger" | "info" | "warning"

export type PurchaseEntryItem = {
  id: number
  product_id: number
  product_name: string | null
  quantity: number
  purchase_price: number
  subtotal: number
}

export type PurchaseEntry = {
  id: number
  reference: string
  warehouse: { id: number; name: string }
  fournisseur: { id: number; name: string }
  remark: string | null
  items: PurchaseEntryItem[]
  total: number
  status: PurchaseEntryStatusValue
  status_label: string
  status_color: BadgeColor
  payment_status: PurchaseEntryPaymentStatusValue
  payment_status_label: string
  payment_status_color: BadgeColor
  paid_amount: number
  remaining_amount: number
  created_at: string
}

export type PurchaseEntryVersement = {
  id: number
  reference: string
  date: string
  amount: number
  wallet_id: number
  wallet_name: string | null
  remark: string | null
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
