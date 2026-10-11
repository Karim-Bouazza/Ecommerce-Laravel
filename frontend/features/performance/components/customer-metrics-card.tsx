"use client"

import { Users } from "lucide-react"

import { MetricRow, PerformanceCard } from "@/features/performance/components/performance-card"
import type { PerformanceRevenueStats } from "@/features/performance/types"
import { formatPrice } from "@/shared/lib/format-price"

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 })

export function CustomerMetricsCard({
  data,
  isPending,
}: {
  data: PerformanceRevenueStats | undefined
  isPending: boolean
}) {
  const loading = isPending || data === undefined
  const money = (value: number | undefined) => (value === undefined ? "—" : (formatPrice(value) ?? "—"))
  const percent = (value: number | undefined) =>
    value === undefined ? "—" : `${numberFormatter.format(value)}%`

  return (
    <PerformanceCard title="Métriques Clients" icon={Users} tone="indigo" busy={loading}>
      <MetricRow
        label="Acheteurs"
        value={data ? numberFormatter.format(data.acheteurs) : "—"}
        loading={loading}
      />
      <MetricRow label="Taux d'acquisition" value={percent(data?.taux_acquisition)} loading={loading} />
      <MetricRow label="Taux de rétention" value={percent(data?.taux_retention)} loading={loading} />
      <MetricRow label="Valeur moyenne par commande (AOV)" value={money(data?.aov)} loading={loading} />
      <MetricRow
        label="Valeur du profit par commande (POV)"
        value={money(data?.pov)}
        loading={loading}
        negative={(data?.pov ?? 0) < 0}
      />
      <MetricRow label="Valeur moyenne de l'acheteur (ACV)" value={money(data?.acv)} loading={loading} />
      <MetricRow
        label="Valeur de profit par acheteur (PCV)"
        value={money(data?.pcv)}
        loading={loading}
        negative={(data?.pcv ?? 0) < 0}
      />
    </PerformanceCard>
  )
}
