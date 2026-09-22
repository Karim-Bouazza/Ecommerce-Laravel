export type ProductAnalyticsMetric = {
  count: number
  quantity: number
}

export type ProductAnalyticsItem = {
  id: number
  name: string
  image: string | null
  nombre_commandes: ProductAnalyticsMetric
  confirme_sans_stock: ProductAnalyticsMetric
  commandes_confirmees: ProductAnalyticsMetric
  commandes_livrees: ProductAnalyticsMetric
  commandes_retournees: ProductAnalyticsMetric
  taux_confirmation: number
  performance_confirmation: number
  taux_livraison: number
  performance_livraison: number
  quantite_vendue: number
  ventes: number
  cout_total_produit: number | null
  marge_brute: number | null
  profit_pourcentage: number
}

export type ProductAnalyticsStats = Omit<ProductAnalyticsItem, "id" | "name" | "image">

export type ProductAnalyticsChartItem = {
  id: number
  name: string
  commandes_livrees: number
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
