"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateBrandDialog } from "@/features/brands/components/create-brand-dialog"
import { brandColumns } from "@/features/brands/components/brand-columns"
import { useBrandList } from "@/features/brands/hooks/use-brand-list"

export function BrandsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useBrandList({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={brandColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucune marque."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher une marque",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateBrandDialog />}
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
