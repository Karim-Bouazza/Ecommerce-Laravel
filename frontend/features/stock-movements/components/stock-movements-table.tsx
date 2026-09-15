"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { stockMovementColumns } from "@/features/stock-movements/components/stock-movement-columns"
import {
  StockMovementFiltersSheet,
  type StockMovementFiltersValue,
} from "@/features/stock-movements/components/stock-movement-filters-sheet"
import { useStockMovements } from "@/features/stock-movements/hooks/use-stock-movements"
import { useWarehouseOptions } from "@/features/stock-movements/hooks/use-warehouse-options"

export function StockMovementsTable() {
  const [warehouseId, setWarehouseId] = React.useState<number | "all">("all")
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<StockMovementFiltersValue>({})
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)
  const { data: warehouses = [] } = useWarehouseOptions()

  React.useEffect(() => {
    setPage(1)
  }, [warehouseId, debouncedSearch, filters, perPage])

  const { data, isPending, isFetching, refetch } = useStockMovements({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    warehouse_id: warehouseId === "all" ? undefined : warehouseId,
    ...filters,
  })

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={String(warehouseId)}
        onValueChange={(value) => setWarehouseId(value === "all" ? "all" : Number(value))}
      >
        <TabsList>
          <TabsTab value="all">Tous</TabsTab>
          {warehouses.map((warehouse) => (
            <TabsTab key={warehouse.id} value={String(warehouse.id)}>
              {warehouse.name}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>

      <DataTable
        columns={stockMovementColumns}
        data={data?.data ?? []}
        isLoading={isPending}
        emptyMessage="Aucun mouvement de stock."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher Code, Nom, Éditeur",
        }}
        toolbarActions={<StockMovementFiltersSheet value={filters} onApply={setFilters} />}
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
