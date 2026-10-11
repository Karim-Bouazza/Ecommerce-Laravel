export type DashboardPeriod = "all_time" | "today" | "yesterday" | "last_week" | "last_month"

export type DashboardMetric = {
  count: number
  percentage: number
}

export type DashboardTopProduct = {
  id: number
  name: string
  image: string | null
  delivered_orders: number
  quantity: number
  sales: number
}

export type DashboardData = {
  filters: {
    date_from: string | null
    date_to: string | null
  }
  stats: {
    total_orders: DashboardMetric
    confirmed_orders: DashboardMetric
    delivered_orders: DashboardMetric
    sales: { amount: number }
  }
  top_products: DashboardTopProduct[]
}
