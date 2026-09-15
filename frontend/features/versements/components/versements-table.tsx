"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateVersementDialog } from "@/features/versements/components/create-versement-dialog"
import { versementColumns } from "@/features/versements/components/versement-columns"
import { useVersements } from "@/features/versements/hooks/use-versements"

export function VersementsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useVersements({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={versementColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun versement."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher Réf, Note, Portefeuille",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateVersementDialog />}
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
