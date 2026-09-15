export type StockItem = {
  id: number
  name: string
  image: string | null
  stock_interne: number
  stock_reserve: number
  stock_en_livraison: number
  stock_en_retour: number
  confirme_sans_stock: number
  vendu: number
  purchase_price: number | null
  valeur_du_stock: number | null
  valeur_en_livraison: number
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
