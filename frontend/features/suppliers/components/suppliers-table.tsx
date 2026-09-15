"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateSupplierDialog } from "@/features/suppliers/components/create-supplier-dialog"
import { supplierColumns } from "@/features/suppliers/components/supplier-columns"
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers"

export function SuppliersTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useSuppliers({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={supplierColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun fournisseur."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher…",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateSupplierDialog />}
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
