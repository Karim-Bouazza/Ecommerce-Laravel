"use client"

import * as React from "react"

import { CustomerMetricsCard } from "@/features/performance/components/customer-metrics-card"
import { DeliveryImpactCard } from "@/features/performance/components/delivery-impact-card"
import { ExpensesCard } from "@/features/performance/components/expenses-card"
import { PerformanceFiltersSheet } from "@/features/performance/components/performance-filters-sheet"
import { PerformanceToolbar } from "@/features/performance/components/performance-toolbar"
import { RatesCard } from "@/features/performance/components/rates-card"
import { SalesEvolutionCard } from "@/features/performance/components/sales-evolution-card"
import { RevenueProfitCard } from "@/features/performance/components/revenue-profit-card"
import { usePerformanceRevenue } from "@/features/performance/hooks/use-performance-revenue"
import type { PerformanceFilters, PerformancePeriod } from "@/features/performance/types"

export function PerformancePage() {
  const [filters, setFilters] = React.useState<PerformanceFilters>({})
  const [period, setPeriod] = React.useState<PerformancePeriod>("this_month")

  // Explicit dates from the filters sheet take precedence over the preset period.
  const hasCustomDates = Boolean(filters.date_from || filters.date_to)
  const queryFilters: PerformanceFilters = hasCustomDates ? filters : { ...filters, period }

  const { data, isPending } = usePerformanceRevenue(queryFilters)

  return (
    <div className="flex flex-col gap-4">
      <PerformanceToolbar
        period={hasCustomDates ? null : period}
        onPeriodChange={(next) => {
          setPeriod(next)
          setFilters((current) => ({ ...current, date_from: undefined, date_to: undefined }))
        }}
        actions={<PerformanceFiltersSheet value={filters} onApply={setFilters} />}
      />

      {/* Cards in the same row stretch to the same height; the gauges span both rows on desktop. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RevenueProfitCard data={data} isPending={isPending} />
        <ExpensesCard data={data} isPending={isPending} />
        <CustomerMetricsCard data={data} isPending={isPending} />
        <DeliveryImpactCard />
        <div className="sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <RatesCard data={data} isPending={isPending} />
        </div>
      </div>

      <SalesEvolutionCard filters={queryFilters} />
    </div>
  )
}
