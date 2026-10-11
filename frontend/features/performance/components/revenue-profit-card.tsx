"use client"

import { Wallet } from "lucide-react"
import { cn } from "cn"

import {
  ComingSoonRow,
  MetricRow,
  PerformanceCard,
} from "@/features/performance/components/performance-card"
import type { PerformanceRevenueStats } from "@/features/performance/types"
import { formatPrice } from "@/shared/lib/format-price"

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function PercentBadge({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        value >= 0
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "bg-destructive/10 text-destructive"
      )}
    >
      {percentFormatter.format(value)}%
    </span>
  )
}

export function RevenueProfitCard({
  data,
  isPending,
}: {
  data: PerformanceRevenueStats | undefined
  isPending: boolean
}) {
  const loading = isPending || data === undefined
  const money = (value: number | undefined) => (value === undefined ? "—" : (formatPrice(value) ?? "—"))

  return (
    <PerformanceCard title="Revenus & Profits" icon={Wallet} tone="emerald" busy={loading}>
      <MetricRow label="Ventes" value={money(data?.ventes)} loading={loading} />
      <MetricRow
        label="Revenus"
        value={money(data?.revenus)}
        loading={loading}
        negative={(data?.revenus ?? 0) < 0}
      />
      <MetricRow
        label="Bénéfices"
        value={money(data?.benefices)}
        loading={loading}
        negative={(data?.benefices ?? 0) < 0}
        badge={data ? <PercentBadge value={data.benefices_pourcentage} /> : undefined}
      />
      <MetricRow
        label="Retour sur investissement (ROI)"
        value={data ? `${percentFormatter.format(data.roi)}%` : "—"}
        loading={loading}
        negative={(data?.roi ?? 0) < 0}
      />
      <ComingSoonRow label="Upsell" />
      <MetricRow label="Capital" value={money(data?.capital)} loading={loading} />
    </PerformanceCard>
  )
}
