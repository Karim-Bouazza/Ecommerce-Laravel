export type Paiement = {
  id: number
  reference: string
  date: string
  creator_name: string | null
  wallet_id: number
  wallet_name: string | null
  amount: number
  remark: string | null
  delivery_company_integration_id: number | null
  delivery_partner_name: string | null
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
