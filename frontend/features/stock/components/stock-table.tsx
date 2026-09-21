"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getStockColumns } from "@/features/stock/components/stock-columns"
import type { StockFiltersValue } from "@/features/stock/components/stock-filters-sheet"
import { StockStatsCards } from "@/features/stock/components/stock-stats-cards"
import { StockToolbarActions } from "@/features/stock/components/stock-toolbar-actions"
import { useStock } from "@/features/stock/hooks/use-stock"
import { useWarehouseOptions } from "@/features/stock/hooks/use-warehouse-options"

export function StockTable() {
  const [warehouseId, setWarehouseId] = React.useState<number | null>(null)
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<StockFiltersValue>({})
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

  const statsParams = {
    search: debouncedSearch || undefined,
    warehouse_id: warehouseId ?? undefined,
    ...filters,
  }

  const { data, isPending, isFetching, refetch } = useStock({
    page,
    per_page: perPage,
    ...statsParams,
  })

  const columns = React.useMemo(() => getStockColumns(warehouseId ?? 0), [warehouseId])

  return (
    <div className="flex flex-col gap-4">
      <StockStatsCards params={statsParams} />

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
        columns={columns}
        data={data?.data ?? []}
        isLoading={isPending || warehouseId === null}
        emptyMessage="Aucun produit en stock."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher Code, Nom, Description",
        }}
        toolbarActions={<StockToolbarActions filters={filters} onFiltersChange={setFilters} />}
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
