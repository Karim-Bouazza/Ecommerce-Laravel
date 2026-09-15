"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { stockAlertColumns } from "@/features/stock-alerts/components/stock-alert-columns"
import {
  StockAlertFiltersSheet,
  type StockAlertFiltersValue,
} from "@/features/stock-alerts/components/stock-alert-filters-sheet"
import { useStockAlerts } from "@/features/stock-alerts/hooks/use-stock-alerts"
import { useWarehouseOptions } from "@/features/stock-alerts/hooks/use-warehouse-options"

export function StockAlertTable() {
  const [warehouseId, setWarehouseId] = React.useState<number | null>(null)
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<StockAlertFiltersValue>({})
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)
  const { data: warehouses = [] } = useWarehouseOptions()

  React.useEffect(() => {
    if (warehouseId === null && warehouses.length > 0) {
      setWarehouseId(warehouses[0].id)
    }
  }, [warehouseId, warehouses])

  React.useEffect(() => {
    setPage(1)
  }, [warehouseId, debouncedSearch, filters, perPage])

  const { data, isPending, isFetching, refetch } = useStockAlerts({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    warehouse_id: warehouseId ?? undefined,
    ...filters,
  })

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={warehouseId !== null ? String(warehouseId) : undefined}
        onValueChange={(value) => setWarehouseId(Number(value))}
      >
        <TabsList>
          {warehouses.map((warehouse) => (
            <TabsTab key={warehouse.id} value={String(warehouse.id)}>
              {warehouse.name}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>

      <DataTable
        columns={stockAlertColumns}
        data={data?.data ?? []}
        isLoading={isPending || warehouseId === null}
        emptyMessage="Tous les produits de cet entrepôt respectent leur stock minimum."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher Code, Nom, Description",
        }}
        toolbarActions={<StockAlertFiltersSheet value={filters} onApply={setFilters} />}
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
