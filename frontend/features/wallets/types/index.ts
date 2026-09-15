export type WalletStats = {
  balance: number
  entries: number
  exits: number
}

export type Wallet = {
  id: number
  name: string
  balance: number
  entries_sum_amount: number
  exits_sum_amount: number
  remark: string | null
}

export type WalletTransactionCategory = "deposit" | "withdrawal" | "versement" | "payment"

export type WalletTransaction = {
  id: number
  reference: string
  date: string
  creator_name: string | null
  amount: number
  remark: string | null
  category: WalletTransactionCategory
  category_label: string
  category_color: "success" | "danger" | "info" | "warning"
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
