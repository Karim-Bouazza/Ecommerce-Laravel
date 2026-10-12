"use client"

import type { ReactNode } from "react"
import { useIsFetching, useQueryClient } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { OrderAnalysisPeriod } from "@/features/order-analysis/types"
import { PeriodChips, type PeriodOption } from "@/shared/components/period-chips"

const PERIODS: readonly PeriodOption<OrderAnalysisPeriod>[] = [
  { value: "all_time", label: "Tout le temps" },
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "last_week", label: "La semaine dernière" },
  { value: "this_month", label: "Ce mois-ci" },
  { value: "last_month", label: "Le mois dernier" },
]

type OrderAnalysisToolbarProps = {
  /** `null` when custom dates from the filters sheet are applied. */
  period: OrderAnalysisPeriod | null
  onPeriodChange: (period: OrderAnalysisPeriod) => void
  filters: ReactNode
  /** Query-key prefix refreshed by the refresh button. */
  queryKey?: readonly string[]
}

export function OrderAnalysisToolbar({
  period,
  onPeriodChange,
  filters,
  queryKey = ["order-analysis"],
}: OrderAnalysisToolbarProps) {
  const queryClient = useQueryClient()
  const fetching = useIsFetching({ queryKey }) > 0

  return (
    <Card className="flex-row flex-wrap items-center justify-between gap-3 px-4">
      <PeriodChips options={PERIODS} value={period} onChange={onPeriodChange} />
      <div className="flex items-center gap-2">
        {filters}
        <Button
          variant="outline"
          size="icon"
          aria-label="Actualiser"
          disabled={fetching}
          onClick={() => queryClient.invalidateQueries({ queryKey })}
        >
          <RefreshCw className={cn("size-4", fetching && "motion-safe:animate-spin")} aria-hidden />
        </Button>
      </div>
    </Card>
  )
}
