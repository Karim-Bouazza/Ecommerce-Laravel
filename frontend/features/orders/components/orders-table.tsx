"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateOrderDialog } from "@/features/orders/components/create-order-dialog"
import { orderColumns } from "@/features/orders/components/order-columns"
import { useOrders } from "@/features/orders/hooks/use-orders"
import type { OrderStatusGroup } from "@/features/orders/types"

type OrdersTableProps = {
  statusGroup?: OrderStatusGroup
}

export function OrdersTable({ statusGroup }: OrdersTableProps) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage, statusGroup])

  const { data, isPending, isFetching, refetch } = useOrders({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    status_group: statusGroup,
  })

  return (
    <DataTable
      columns={orderColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucune commande."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher Code, Nom du client, Téléphone",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateOrderDialog />}
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
