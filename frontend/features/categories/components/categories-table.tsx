"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateCategoryDialog } from "@/features/categories/components/create-category-dialog"
import { categoryColumns } from "@/features/categories/components/category-columns"
import { useCategoryList } from "@/features/categories/hooks/use-category-list"

export function CategoriesTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useCategoryList({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={categoryColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucune catégorie."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher une catégorie",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateCategoryDialog />}
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
