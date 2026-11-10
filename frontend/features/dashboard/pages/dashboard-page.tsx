"use client"

import * as React from "react"

import { DashboardFiltersSheet, type DashboardFiltersValue } from "@/features/dashboard/components/dashboard-filters-sheet"
import { DashboardStatCards } from "@/features/dashboard/components/dashboard-stat-cards"
import {
  DashboardToolbar,
  type DashboardPeriodSelection,
  type DashboardViewMode,
} from "@/features/dashboard/components/dashboard-toolbar"
import { TopProductsWidget } from "@/features/dashboard/components/top-products-widget"
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard"
import type { DashboardPeriod } from "@/features/dashboard/types"

export function DashboardPage() {
  const [period, setPeriod] = React.useState<DashboardPeriod>("all_time")
  const [filters, setFilters] = React.useState<DashboardFiltersValue>({})
  const [viewMode, setViewMode] = React.useState<DashboardViewMode>("numbers")

  const hasCustomDates = Boolean(filters.date_from || filters.date_to)
  const selection: DashboardPeriodSelection = hasCustomDates ? "custom" : period

  const { data } = useDashboard({
    ...filters,
    period: hasCustomDates ? undefined : period,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-semibold">Tableau de bord</h1>
        <DashboardFiltersSheet value={filters} onApply={setFilters} />
      </div>

      <DashboardToolbar
        period={selection}
        onPeriodChange={(next) => {
          setPeriod(next)
          setFilters((current) => ({ ...current, date_from: undefined, date_to: undefined }))
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DashboardStatCards stats={data?.stats} viewMode={viewMode} />

      <TopProductsWidget products={data?.top_products} />
    </div>
  )
}
