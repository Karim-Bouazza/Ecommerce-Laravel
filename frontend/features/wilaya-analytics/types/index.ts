export type WilayaAnalyticsMetric = {
  count: number
  percentage: number
}

export type WilayaAnalyticsItem = {
  id: number
  name: string
  nombre_commandes: WilayaAnalyticsMetric
  commandes_confirmees: WilayaAnalyticsMetric
  commandes_livrees: WilayaAnalyticsMetric
  commandes_retournees: WilayaAnalyticsMetric
  taux_confirmation: number
  performance_confirmation: number
  taux_livraison: number
  performance_livraison: number
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
