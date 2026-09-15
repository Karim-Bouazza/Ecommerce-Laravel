"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateReturnEntryDialog } from "@/features/return-entries/components/create-return-entry-dialog"
import { returnEntryColumns } from "@/features/return-entries/components/return-entry-columns"
import { useReturnEntries } from "@/features/return-entries/hooks/use-return-entries"

export function ReturnEntriesTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useReturnEntries({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={returnEntryColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucune entrée de retour."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher Code, Nom, Description",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateReturnEntryDialog />}
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
