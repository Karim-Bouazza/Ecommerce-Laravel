"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { OrderAnalysisToolbar } from "@/features/order-analysis/components/order-analysis-toolbar"
import type { OrderAnalysisPeriod } from "@/features/order-analysis/types"
import { productAnalyticsColumns } from "@/features/product-analytics/components/product-analytics-columns"
import {
  ProductAnalyticsFiltersSheet,
  type ProductAnalyticsFiltersValue,
} from "@/features/product-analytics/components/product-analytics-filters-sheet"
import { ProductAnalyticsDeliveredChart } from "@/features/product-analytics/components/product-analytics-delivered-chart"
import { ProductAnalyticsStatsCards } from "@/features/product-analytics/components/product-analytics-stats-cards"
import { useProductAnalytics } from "@/features/product-analytics/hooks/use-product-analytics"

export function ProductAnalyticsTable() {
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<ProductAnalyticsFiltersValue>({})
  const [period, setPeriod] = React.useState<OrderAnalysisPeriod>("this_month")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters, period, perPage])

  // Explicit dates from the filters sheet take precedence over the preset period.
  const hasCustomDates = Boolean(filters.date_from || filters.date_to)

  const queryParams = {
    search: debouncedSearch || undefined,
    ...filters,
    period: hasCustomDates ? undefined : period,
  }

  const { data, isPending, isFetching } = useProductAnalytics({
    page,
    per_page: perPage,
    ...queryParams,
  })

  return (
    <div className="flex flex-col gap-4">
      <OrderAnalysisToolbar
        queryKey={["product-analytics"]}
        period={hasCustomDates ? null : period}
        onPeriodChange={(next) => {
          setPeriod(next)
          setFilters((current) => ({ ...current, date_from: undefined, date_to: undefined }))
        }}
        filters={<ProductAnalyticsFiltersSheet value={filters} onApply={setFilters} />}
      />

      <ProductAnalyticsStatsCards params={queryParams} />

      <ProductAnalyticsDeliveredChart params={queryParams} />

      <DataTable
        columns={productAnalyticsColumns}
        data={data?.data ?? []}
        isLoading={isPending}
        emptyMessage="Aucun produit trouvé."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher un produit",
        }}
        pagination={{
          pageIndex: data?.meta.current_page ?? page,
          pageCount: data?.meta.last_page ?? 1,
          pageSize: perPage,
          total: data?.meta.total ?? 0,
          onPageIndexChange: setPage,
          onPageSizeChange: setPerPage,
        }}
        className={isFetching ? "opacity-70 transition-opacity" : undefined}
      />
    </div>
  )
}
