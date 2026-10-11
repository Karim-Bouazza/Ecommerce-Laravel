"use client"

import { Gauge } from "lucide-react"

import { PerformanceCard } from "@/features/performance/components/performance-card"
import { RateGauge } from "@/features/performance/components/rate-gauge"
import type { PerformanceRevenueStats } from "@/features/performance/types"

export function RatesCard({
  data,
  isPending,
}: {
  data: PerformanceRevenueStats | undefined
  isPending: boolean
}) {
  const loading = isPending || data === undefined

  return (
    <PerformanceCard title="Performance" icon={Gauge} tone="violet" busy={loading}>
      <div className="flex flex-col gap-6 py-2">
        <RateGauge label="Taux de Confirmation" value={data?.taux_confirmation} loading={loading} />
        <RateGauge label="Taux de Livraison" value={data?.taux_livraison} loading={loading} />
        <RateGauge
          label="Performance de conf."
          value={data?.performance_confirmation}
          loading={loading}
        />
        <RateGauge
          label="Performance de livr."
          value={data?.performance_livraison}
          loading={loading}
        />
      </div>
    </PerformanceCard>
  )
}
