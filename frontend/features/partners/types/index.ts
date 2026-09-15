export type DeliveryCompanyIntegration = {
  company_key: string
  name: string
  base_url: string
  has_token: boolean
  updated_at: string | null
}

export type DeliveryCompanyIntegrationListItem = {
  id: number
  company_key: string
  entreprise: string
  name: string | null
}
