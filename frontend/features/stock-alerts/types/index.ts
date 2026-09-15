export type StockAlertItem = {
  id: number
  name: string
  image: string | null
  stock_minimum: number
  stock_interne: number
  stock_reserve: number
  stock_en_livraison: number
  stock_en_retour: number
  vendu: number
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
