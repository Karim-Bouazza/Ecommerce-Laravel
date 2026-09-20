export type BadgeColor =
  | "success"
  | "danger"
  | "info"
  | "warning"
  | "gray"
  | "indigo"
  | "purple"
  | "primary"
  | "orange"

export type OrderItem = {
  id: number
  product_id: number
  product_name: string | null
  variant: string | null
  warehouse_id: number | null
  warehouse_name: string | null
  quantity: number
  price: number
  total_price: number
}

export type OrderStatusTransition = {
  value: string
  label: string
}

export type OrderStatusHistoryEntry = {
  id: number
  status: string
  status_label: string
  status_color: BadgeColor
  previous_status: string | null
  previous_status_label: string | null
  previous_status_color: BadgeColor | null
  user_name: string | null
  created_at: string
}

export type Order = {
  id: number
  reference: string
  status: string
  status_label: string
  status_color: BadgeColor
  status_transitions: OrderStatusTransition[]
  is_editable: boolean
  payment_status: string
  payment_status_label: string
  type: string
  type_label: string
  delivery_type: string
  delivery_type_label: string
  stop_desk_company_id: number | null
  stop_desk_company_name: string | null
  provider_office_id: string | null
  client_id: number | null
  first_name: string | null
  last_name: string | null
  client_name: string
  phone_number: string | null
  wilaya_id: number | null
  wilaya_name: string | null
  commune_id: number | null
  commune_name: string | null
  address: string | null
  provider_wilaya_id: number | null
  provider_commune_id: number | null
  delivery_note: string | null
  name: string | null
  provider_order_id: string | null
  free_delivery: boolean
  can_be_opened: boolean
  subtotal: number
  delivery_price: number
  total_price: number
  scheduled_at: string | null
  date_report: string | null
  created_at: string
  status_changed_at: string
  items: OrderItem[]
}

export type OrderStatusGroup =
  | "nouvelles"
  | "en_cours"
  | "confirmees"
  | "suivi"
  | "terminees"
  | "annulees"

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
