import type { ChargeTypeValue } from "@/features/charges/constants/charge-types"
import type { ChargeOrderTriggerValue } from "@/features/charges/constants/charge-order-triggers"
import type { ChargeRecurrenceFrequencyValue } from "@/features/charges/constants/charge-recurrence-frequencies"

export interface Charge {
  id: number
  category: string
  category_label: string
  type: ChargeTypeValue
  type_label: string
  order_trigger: ChargeOrderTriggerValue | null
  order_trigger_label: string | null
  recurrence_frequency: ChargeRecurrenceFrequencyValue | null
  recurrence_frequency_label: string | null
  name: string
  amount: number
  starts_at: string | null
  ends_at: string | null
  all_products: boolean
  product_ids: number[]
  product_names: string[]
  paid_amount: number
  remaining_amount: number
  payment_status: "unpaid" | "partial" | "paid"
  payment_status_label: string
  payment_status_color: "success" | "danger" | "info" | "warning"
  created_at: string
}

export type ChargeVersement = {
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
