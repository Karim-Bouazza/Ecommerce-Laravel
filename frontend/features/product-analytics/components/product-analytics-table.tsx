"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { productAnalyticsColumns } from "@/features/product-analytics/components/product-analytics-columns"
import {
  ProductAnalyticsFiltersSheet,
  type ProductAnalyticsFiltersValue,
} from "@/features/product-analytics/components/product-analytics-filters-sheet"
import { ProductAnalyticsStatsCards } from "@/features/product-analytics/components/product-analytics-stats-cards"
import { useProductAnalytics } from "@/features/product-analytics/hooks/use-product-analytics"

export function ProductAnalyticsTable() {
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<ProductAnalyticsFiltersValue>({})
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters, perPage])

  const queryParams = {
    search: debouncedSearch || undefined,
    ...filters,
  }

  const { data, isPending, isFetching, refetch } = useProductAnalytics({
    page,
    per_page: perPage,
    ...queryParams,
  })

  return (
    <div className="flex flex-col gap-4">
      <ProductAnalyticsStatsCards params={queryParams} />

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
        toolbarActions={<ProductAnalyticsFiltersSheet value={filters} onApply={setFilters} />}
        onRefresh={() => refetch()}
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
