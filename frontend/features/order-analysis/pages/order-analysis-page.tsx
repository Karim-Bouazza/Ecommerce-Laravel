"use client"

import * as React from "react"
import { Activity, LayoutGrid } from "lucide-react"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { ConfirmationCard } from "@/features/order-analysis/components/confirmation-card"
import { OrderAnalysisFiltersSheet } from "@/features/order-analysis/components/order-analysis-filters-sheet"
import { OrderAnalysisToolbar } from "@/features/order-analysis/components/order-analysis-toolbar"
import { StatusBreakdownTable } from "@/features/order-analysis/components/status-breakdown-table"
import { StatusDonutCard } from "@/features/order-analysis/components/status-donut-card"
import { TrackingCard } from "@/features/order-analysis/components/tracking-card"
import { useOrderAnalysis } from "@/features/order-analysis/hooks/use-order-analysis"
import { useOrderStatusBreakdown } from "@/features/order-analysis/hooks/use-order-status-breakdown"
import type { OrderAnalysisFilters, OrderAnalysisPeriod } from "@/features/order-analysis/types"

type AnalysisTab = "overview" | "statuses"

export function OrderAnalysisPage() {
  const [tab, setTab] = React.useState<AnalysisTab>("overview")
  const [filters, setFilters] = React.useState<OrderAnalysisFilters>({})
  const [period, setPeriod] = React.useState<OrderAnalysisPeriod>("this_month")

  // Explicit dates from the filters sheet take precedence over the preset period.
  const hasCustomDates = Boolean(filters.date_from || filters.date_to)
  const queryFilters: OrderAnalysisFilters = hasCustomDates ? filters : { ...filters, period }

  const { data, isPending } = useOrderAnalysis(queryFilters)
  const { data: breakdown } = useOrderStatusBreakdown(queryFilters, tab === "statuses")

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={(value) => setTab(value as AnalysisTab)} className="gap-4">
        <TabsList aria-label="Vue">
          <TabsTab value="overview">
            <LayoutGrid className="size-4" aria-hidden />
            Aperçu
          </TabsTab>
          <TabsTab value="statuses">
            <Activity className="size-4" aria-hidden />
            Activité en temps réel
          </TabsTab>
        </TabsList>

        <OrderAnalysisToolbar
          period={hasCustomDates ? null : period}
          onPeriodChange={(next) => {
            setPeriod(next)
            setFilters((current) => ({ ...current, date_from: undefined, date_to: undefined }))
          }}
          filters={<OrderAnalysisFiltersSheet value={filters} onApply={setFilters} />}
        />

        <TabsPanel value="overview" className="grid gap-4 lg:grid-cols-2">
          <ConfirmationCard data={data} isPending={isPending} />
          <TrackingCard data={data} isPending={isPending} />
        </TabsPanel>

        <TabsPanel value="statuses" className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <StatusDonutCard key={index} group={breakdown?.groups[index]} />
            ))}
          </div>
          <StatusBreakdownTable data={breakdown} />
        </TabsPanel>
      </Tabs>
    </div>
  )
}
