"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateProductDialog } from "@/features/products/components/create-product-dialog"
import { productColumns } from "@/features/products/components/product-columns"
import { useProducts } from "@/features/products/hooks/use-products"

export function ProductsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useProducts({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={productColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun produit."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher Code, Nom, Description",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateProductDialog />}
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
