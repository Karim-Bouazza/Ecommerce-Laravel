"use client"

import type { ReactNode } from "react"

import { Card } from "@/components/ui/card"
import type { PerformancePeriod } from "@/features/performance/types"
import { PeriodChips, type PeriodOption } from "@/shared/components/period-chips"

const PERIODS: readonly PeriodOption<PerformancePeriod>[] = [
  { value: "all_time", label: "Tout le temps" },
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "last_week", label: "La semaine dernière" },
  { value: "this_month", label: "Ce mois-ci" },
  { value: "last_month", label: "Le mois dernier" },
]

type PerformanceToolbarProps = {
  /** `null` when custom dates from the filters sheet are applied. */
  period: PerformancePeriod | null
  onPeriodChange: (period: PerformancePeriod) => void
  actions?: ReactNode
}

export function PerformanceToolbar({ period, onPeriodChange, actions }: PerformanceToolbarProps) {
  return (
    <Card className="flex-row flex-wrap items-center justify-between gap-3 px-4">
      <PeriodChips options={PERIODS} value={period} onChange={onPeriodChange} />
      {actions}
    </Card>
  )
}
