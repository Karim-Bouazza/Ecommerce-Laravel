"use client"

import {
  Ban,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Hourglass,
  ShieldAlert,
  ShoppingCart,
} from "lucide-react"

import { OrderMetricRow } from "@/features/order-analysis/components/order-metric-row"
import type { OrderAnalysis } from "@/features/order-analysis/types"
import { PerformanceCard } from "@/features/performance/components/performance-card"

const percentFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 })

export function ConfirmationCard({
  data,
  isPending,
}: {
  data: OrderAnalysis | undefined
  isPending: boolean
}) {
  const loading = isPending || data === undefined
  const stats = data?.confirmation

  return (
    <PerformanceCard title="Confirmation" icon={ClipboardList} tone="emerald" busy={loading}>
      <OrderMetricRow
        label="Total des commandes (valides)"
        icon={ShoppingCart}
        tone="gray"
        value={stats?.valid_orders}
        loading={loading}
        badge={
          stats ? (
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
              ({stats.total_orders}) {percentFormatter.format(stats.valid_percentage)} %
            </span>
          ) : null
        }
      />
      <OrderMetricRow label="Commandes en attente" icon={Hourglass} tone="blue" value={stats?.pending} loading={loading} />
      <OrderMetricRow label="Commandes confirmées" icon={CheckCircle2} tone="emerald" value={stats?.confirmed} loading={loading} />
      <OrderMetricRow label="Commandes reportées" icon={CalendarClock} tone="amber" value={stats?.postponed} loading={loading} />
      <OrderMetricRow label="Commandes annulées" icon={Ban} tone="red" value={stats?.cancelled} loading={loading} />
      <OrderMetricRow label="Faux numéro / doublons" icon={ShieldAlert} tone="gray" value={stats?.invalid} loading={loading} />
    </PerformanceCard>
  )
}
