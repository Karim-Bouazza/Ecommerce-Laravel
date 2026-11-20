export type MetaAdAccount = {
  id: string
  name: string | null
  currency: string | null
}

export type MetaConnection = {
  app_id: string | null
  has_secret: boolean
  connected: boolean
  expired: boolean
  expires_at: string | null
  ad_account: MetaAdAccount | null
  ad_accounts: MetaAdAccount[]
  rate: number
}

export type MetaCampaignSpend = {
  id: string
  name: string
  usd: number
  dzd: number
  product_id: number | null
}

export type MetaProductSpend = {
  product_id: number
  name: string
  usd: number
  dzd: number
}

export type MetaSpend = {
  rate: number
  total_dzd: number
  linked_dzd: number
  unlinked_dzd: number
  products: MetaProductSpend[]
  campaigns: MetaCampaignSpend[]
}

export type MetaDateRange = {
  date_from: string
  date_to: string
}
