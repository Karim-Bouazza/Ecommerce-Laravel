"use client"

import { Landmark } from "lucide-react"

import {
  ComingSoonRow,
  MetricRow,
  PerformanceCard,
} from "@/features/performance/components/performance-card"
import type { PerformanceRevenueStats } from "@/features/performance/types"
import { formatPrice } from "@/shared/lib/format-price"

export function ExpensesCard({
  data,
  isPending,
}: {
  data: PerformanceRevenueStats | undefined
  isPending: boolean
}) {
  const loading = isPending || data === undefined
  const money = (value: number | undefined) => (value === undefined ? "—" : (formatPrice(value) ?? "—"))

  return (
    <PerformanceCard title="Dépenses & Frais" icon={Landmark} tone="orange" busy={loading}>
      <MetricRow label="Charges" value={money(data?.charges)} loading={loading} />
      <ComingSoonRow label="Frais de livraison" />
      <ComingSoonRow label="Frais de retour" />
      <MetricRow label="Coût des Produits" value={money(data?.cout_produits)} loading={loading} />
      <ComingSoonRow label="Ventes Marketers" />
      <ComingSoonRow label="Frais d'agent" />
    </PerformanceCard>
  )
}
