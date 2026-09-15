"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateTransferDialog } from "@/features/transfers/components/create-transfer-dialog"
import { getTransferColumns } from "@/features/transfers/components/transfer-columns"
import { useTransfers } from "@/features/transfers/hooks/use-transfers"
import { useWarehouseOptions } from "@/features/transfers/hooks/use-warehouse-options"

type TransfersTableProps = {
  initialWarehouseId?: number | null
}

export function TransfersTable({ initialWarehouseId = null }: TransfersTableProps) {
  const [warehouseId, setWarehouseId] = React.useState<number | "all">(initialWarehouseId ?? "all")
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)
  const { data: warehouses = [] } = useWarehouseOptions()

  React.useEffect(() => {
    setPage(1)
  }, [warehouseId, debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useTransfers({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    warehouse_id: warehouseId === "all" ? undefined : warehouseId,
  })

  const columns = React.useMemo(
    () => getTransferColumns(warehouseId === "all" ? null : warehouseId),
    [warehouseId]
  )

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
        columns={columns}
        data={data?.data ?? []}
        isLoading={isPending}
        emptyMessage="Aucun transfert."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher Code, Nom, Description",
        }}
        onRefresh={() => refetch()}
        toolbarActions={<CreateTransferDialog />}
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
