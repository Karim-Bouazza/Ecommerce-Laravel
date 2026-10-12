import type { BadgeColor } from "@/features/orders/types"

export type OrderAnalysisPeriod =
  | "all_time"
  | "today"
  | "yesterday"
  | "last_week"
  | "this_month"
  | "last_month"

export type OrderAnalysisDateBasis = "created_at" | "status_changed_at"

export type OrderAnalysisFilters = {
  period?: OrderAnalysisPeriod
  date_basis?: OrderAnalysisDateBasis
  date_from?: string
  date_to?: string
  product_id?: number
  wilaya_id?: number
}

export type OrderAnalysis = {
  confirmation: {
    total_orders: number
    valid_orders: number
    valid_percentage: number
    pending: number
    confirmed: number
    postponed: number
    cancelled: number
    invalid: number
  }
  tracking: {
    shipped: number
    in_delivery: number
    cancelled: number
    delivered: number
    returned: number
  }
}

export type OrderStatusCount = {
  status: string
  label: string
  color: BadgeColor
  count: number
  percentage: number
}

export type OrderStatusGroup = {
  key: string
  label: string
  total: number
  statuses: OrderStatusCount[]
}

export type OrderStatusBreakdown = {
  total: number
  groups: OrderStatusGroup[]
}
