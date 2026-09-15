"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateWarehouseDialog } from "@/features/warehouses/components/create-warehouse-dialog"
import { warehouseColumns } from "@/features/warehouses/components/warehouse-columns"
import { useWarehouses } from "@/features/warehouses/hooks/use-warehouses"

export function WarehousesTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useWarehouses({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={warehouseColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun entrepôt."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher Code, Nom, Description",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateWarehouseDialog />}
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
