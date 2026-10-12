import type { OrderAnalysisFilters } from "@/features/order-analysis/types"

export type SalesChannelFilters = OrderAnalysisFilters & {
  min_orders?: number
  max_orders?: number
}

export type SalesChannel = {
  type: string
  kind: string
  name: string
  orders: number
  confirmed: number
  delivered: number
  returned: number
  confirmation_rate: number
  delivery_rate: number
  delivery_performance: number
  sales: number
}

export type SalesChannelChartSeries = { key: string; label: string }

export type SalesChannelChartPoint = { date: string } & Record<string, number | string>

export type SalesChannelChart = {
  granularity: "day" | "month"
  series: SalesChannelChartSeries[]
  points: SalesChannelChartPoint[]
}
