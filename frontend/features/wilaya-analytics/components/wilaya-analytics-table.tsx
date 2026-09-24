"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  getWilayaAnalyticsColumns,
  type WilayaAnalyticsDisplayMode,
} from "@/features/wilaya-analytics/components/wilaya-analytics-columns"
import {
  WilayaAnalyticsFiltersSheet,
  type WilayaAnalyticsFiltersValue,
} from "@/features/wilaya-analytics/components/wilaya-analytics-filters-sheet"
import { useWilayaAnalytics } from "@/features/wilaya-analytics/hooks/use-wilaya-analytics"

export function WilayaAnalyticsTable() {
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<WilayaAnalyticsFiltersValue>({})
  const [displayMode, setDisplayMode] = React.useState<WilayaAnalyticsDisplayMode>("count")
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

  const { data, isPending, isFetching, refetch } = useWilayaAnalytics({
    page,
    per_page: perPage,
    ...queryParams,
  })

  const columns = React.useMemo(() => getWilayaAnalyticsColumns(displayMode), [displayMode])

  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucune wilaya trouvée."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher une wilaya",
      }}
      toolbarActions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="wilaya-analytics-display-mode" className="text-sm text-muted-foreground">
              Nombre
            </Label>
            <Switch
              id="wilaya-analytics-display-mode"
              checked={displayMode === "percentage"}
              onCheckedChange={(checked) => setDisplayMode(checked ? "percentage" : "count")}
            />
            <Label htmlFor="wilaya-analytics-display-mode" className="text-sm text-muted-foreground">
              Pourcentage
            </Label>
          </div>
          <WilayaAnalyticsFiltersSheet value={filters} onApply={setFilters} />
        </div>
      }
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
  )
}
