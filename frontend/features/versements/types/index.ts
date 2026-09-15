export type VersementStats = {
  total_dues: number
  total_paid: number
  total_remaining: number
}

export type Versement = {
  id: number
  reference: string
  date: string
  creator_name: string | null
  wallet_id: number
  wallet_name: string | null
  amount: number
  remark: string | null
  type: "fournisseur"
  type_label: string
  fournisseur_id: number | null
  fournisseur_name: string | null
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
