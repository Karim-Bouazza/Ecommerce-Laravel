"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreatePaiementDialog } from "@/features/paiements/components/create-paiement-dialog"
import { paiementColumns } from "@/features/paiements/components/paiement-columns"
import { usePaiements } from "@/features/paiements/hooks/use-paiements"

export function PaiementsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = usePaiements({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={paiementColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun paiement."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher Réf, Note, Portefeuille",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreatePaiementDialog />}
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
