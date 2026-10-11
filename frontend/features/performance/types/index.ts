export type PerformanceRevenueStats = {
  taux_confirmation: number
  taux_livraison: number
  performance_confirmation: number
  performance_livraison: number
  acheteurs: number
  taux_acquisition: number
  taux_retention: number
  aov: number
  pov: number
  acv: number
  pcv: number
  ventes: number
  revenus: number
  benefices: number
  benefices_pourcentage: number
  roi: number
  capital: number
  charges: number
  cout_produits: number
}

export type PerformanceDateBasis = "created_at" | "status_changed_at"

export type PerformancePeriod =
  | "all_time"
  | "today"
  | "yesterday"
  | "last_week"
  | "this_month"
  | "last_month"

export type PerformanceFilters = {
  period?: PerformancePeriod
  date_basis?: PerformanceDateBasis
  date_from?: string
  date_to?: string
  product_id?: number
  warehouse_id?: number
}

export type SalesEvolutionPoint = {
  date: string
  ventes: number
  capital: number
}

export type SalesEvolution = {
  series: SalesEvolutionPoint[]
}
