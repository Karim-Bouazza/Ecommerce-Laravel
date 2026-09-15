"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreatePurchaseEntryDialog } from "@/features/purchase-entries/components/create-purchase-entry-dialog"
import { purchaseEntryColumns } from "@/features/purchase-entries/components/purchase-entry-columns"
import { usePurchaseEntries } from "@/features/purchase-entries/hooks/use-purchase-entries"

export function PurchaseEntriesTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = usePurchaseEntries({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={purchaseEntryColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucune entrée d'achat."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher Code, Nom, Description",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreatePurchaseEntryDialog />}
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
