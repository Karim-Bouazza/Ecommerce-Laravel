export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type ReviewLabel = "UNKNOWN" | "LEGITIMATE" | "CONFIRMED_FAKE"
export type IdentifierType = "fingerprint" | "phone" | "ip" | "address"

export type FraudReview = {
  label: ReviewLabel
  reason: string | null
  reviewed_by: string | null
  reviewed_at: string | null
}

export type FraudAssessment = {
  order_id: number
  order_reference: string | null
  order_status: string | null
  order_status_label: string | null
  customer_name: string | null
  customer_phone: string | null
  score: number
  risk_level: RiskLevel
  recommended_action: string
  daily_points: number
  historical_points: number
  outcome_points: number
  excluded_ip_points: number
  counts: Record<IdentifierType, number | null>
  confirmed_fake_matches: Partial<Record<IdentifierType, number>>
  browser: string | null
  os: string | null
  device_category: string | null
  ip_address: string | null
  has_fingerprint: boolean
  review: FraudReview
  rules_version: string
  assessed_at: string | null
  order_created_at: string | null
}

export type FraudReason = {
  rule: string
  component: "daily" | "historical" | "outcome" | "excluded_ip"
  identifier: IdentifierType
  points: number
  evidence: Record<string, unknown>
  explanation: string
}

export type FraudRelatedOrder = {
  order_id: number
  reference: string | null
  status: string | null
  status_label: string | null
  review_label: ReviewLabel
  shared: IdentifierType[]
  created_at: string | null
}

export type FraudScoreHistory = {
  old_score: number | null
  new_score: number
  old_risk_level: RiskLevel | null
  new_risk_level: RiskLevel
  trigger: string
  created_at: string | null
}

export type FraudAssessmentDetail = FraudAssessment & {
  reasons: FraudReason[]
  related_orders: FraudRelatedOrder[]
  history: FraudScoreHistory[]
}

export type FraudFilters = {
  page?: number
  per_page?: number
  search?: string
  risk_level?: RiskLevel
  review_label?: ReviewLabel
}

export type FraudPaginated = {
  data: FraudAssessment[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

export type ReviewPayload = { label: ReviewLabel; reason?: string }

export type ExcludedIpType = "exact" | "wildcard" | "cidr"

export type ExcludedIp = {
  id: number
  pattern: string
  type: ExcludedIpType
  note: string | null
  created_at: string | null
}

export type ExcludedIpPayload = {
  pattern: string
  note?: string
}
