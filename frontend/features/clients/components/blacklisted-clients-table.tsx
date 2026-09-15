"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { blacklistedClientColumns } from "@/features/clients/components/blacklisted-client-columns"
import { useBlacklistedClients } from "@/features/clients/hooks/use-blacklisted-clients"

export function BlacklistedClientsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useBlacklistedClients({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={blacklistedClientColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun client dans la liste noire."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher par Nom, Téléphone, Ville, Adresse",
      }}
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
