"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateTagDialog } from "@/features/tags/components/create-tag-dialog"
import { tagColumns } from "@/features/tags/components/tag-columns"
import { useTagList } from "@/features/tags/hooks/use-tag-list"

export function TagsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useTagList({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={tagColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucune étiquette."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher une étiquette",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateTagDialog />}
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
