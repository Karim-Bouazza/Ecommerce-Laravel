"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreatePixelDialog } from "@/features/pixels/components/create-pixel-dialog"
import { pixelColumns } from "@/features/pixels/components/pixel-columns"
import { usePixelList } from "@/features/pixels/hooks/use-pixel-list"

export function PixelsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = usePixelList({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={pixelColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun pixel."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher un pixel",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreatePixelDialog />}
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
