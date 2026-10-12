"use client"

import { Ban, PackageCheck, Truck, Undo2 } from "lucide-react"

import { OrderMetricRow } from "@/features/order-analysis/components/order-metric-row"
import type { OrderAnalysis } from "@/features/order-analysis/types"
import { PerformanceCard } from "@/features/performance/components/performance-card"

export function TrackingCard({
  data,
  isPending,
}: {
  data: OrderAnalysis | undefined
  isPending: boolean
}) {
  const loading = isPending || data === undefined
  const stats = data?.tracking

  return (
    <PerformanceCard title="Suivi" icon={Truck} tone="violet" busy={loading}>
      <OrderMetricRow label="Commandes expédiées" icon={Truck} tone="indigo" value={stats?.shipped} loading={loading} />
      <OrderMetricRow label="Commandes en cours de livraison" icon={Truck} tone="blue" value={stats?.in_delivery} loading={loading} />
      <OrderMetricRow label="Commandes annulées" icon={Ban} tone="red" value={stats?.cancelled} loading={loading} />
      <OrderMetricRow label="Commandes livrées" icon={PackageCheck} tone="emerald" value={stats?.delivered} loading={loading} />
      <OrderMetricRow label="Commandes retournées" icon={Undo2} tone="red" value={stats?.returned} loading={loading} />
    </PerformanceCard>
  )
}
