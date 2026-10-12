"use client"

import * as React from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { OrderAnalysisFiltersSheet } from "@/features/order-analysis/components/order-analysis-filters-sheet"
import { OrderAnalysisToolbar } from "@/features/order-analysis/components/order-analysis-toolbar"
import type { OrderAnalysisPeriod } from "@/features/order-analysis/types"
import { SalesChannelChartCard } from "@/features/sales-channel-analysis/components/sales-channel-chart"
import { SalesChannelsTable } from "@/features/sales-channel-analysis/components/sales-channels-table"
import { useSalesChannelChart } from "@/features/sales-channel-analysis/hooks/use-sales-channel-chart"
import { useSalesChannels } from "@/features/sales-channel-analysis/hooks/use-sales-channels"
import type { SalesChannelFilters } from "@/features/sales-channel-analysis/types"

const QUERY_KEY = ["sales-channel-analysis"] as const

const COMING_SOON_FILTERS = [
  { label: "Agent", placeholder: "Tous les agents" },
  { label: "Marketer", placeholder: "Tous les marketers" },
]

function toCount(value: string): number | undefined {
  return value === "" ? undefined : Math.max(0, Math.trunc(Number(value)))
}

export function SalesChannelAnalysisPage() {
  const [filters, setFilters] = React.useState<SalesChannelFilters>({})
  const [period, setPeriod] = React.useState<OrderAnalysisPeriod>("this_month")

  // Explicit dates from the filters sheet take precedence over the preset period.
  const hasCustomDates = Boolean(filters.date_from || filters.date_to)
  const queryFilters: SalesChannelFilters = hasCustomDates ? filters : { ...filters, period }

  const { data: channels, isPending } = useSalesChannels(queryFilters)
  const { data: chart } = useSalesChannelChart(queryFilters)

  return (
    <div className="flex flex-col gap-4">
      <OrderAnalysisToolbar
        queryKey={QUERY_KEY}
        period={hasCustomDates ? null : period}
        onPeriodChange={(next) => {
          setPeriod(next)
          setFilters((current) => ({ ...current, date_from: undefined, date_to: undefined }))
        }}
        filters={
          <OrderAnalysisFiltersSheet<SalesChannelFilters>
            value={filters}
            onApply={setFilters}
            comingSoon={COMING_SOON_FILTERS}
            extraFields={(draft, update) => (
              <>
                <Field>
                  <FieldLabel>Commandes min</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={draft.min_orders ?? ""}
                    onChange={(event) => update({ min_orders: toCount(event.target.value) })}
                  />
                </Field>
                <Field>
                  <FieldLabel>Commandes max</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={draft.max_orders ?? ""}
                    onChange={(event) => update({ max_orders: toCount(event.target.value) })}
                  />
                </Field>
              </>
            )}
          />
        }
      />

      <SalesChannelChartCard data={chart} />
      <SalesChannelsTable data={channels} isLoading={isPending} />
    </div>
  )
}
