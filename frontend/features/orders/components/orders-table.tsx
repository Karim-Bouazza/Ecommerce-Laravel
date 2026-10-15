"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateOrderDialog } from "@/features/orders/components/create-order-dialog"
import { OrderStatusStats } from "@/features/orders/components/order-status-stats"
import { orderColumns } from "@/features/orders/components/order-columns"
import { useOrders } from "@/features/orders/hooks/use-orders"
import type { OrderStatusGroup } from "@/features/orders/types"

const ALL_STATUSES = "all"

type OrdersTableProps = {
  statusGroup?: OrderStatusGroup
}

export function OrdersTable({ statusGroup }: OrdersTableProps) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const [status, setStatus] = React.useState(ALL_STATUSES)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setStatus(ALL_STATUSES)
  }, [statusGroup])

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage, statusGroup, status])

  const { data, isPending, isFetching, refetch } = useOrders({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    status_group: statusGroup,
    status: status === ALL_STATUSES ? undefined : status,
  })

  const statusOptions = data?.filters?.statuses ?? []

  return (
    <div className="flex flex-col gap-5">
    <OrderStatusStats
      stats={data?.stats ?? []}
      selected={status}
      onSelect={setStatus}
      isLoading={isPending}
    />
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
      toolbarActions={
        <>
          {statusOptions.length > 0 && (
            <Select value={status} onValueChange={(next) => setStatus(next ?? ALL_STATUSES)}>
              <SelectTrigger className="w-48">
                <SelectValue>
                  {(selected: string | null) =>
                    statusOptions.find((option) => option.value === selected)?.label ?? "Tous les statuts"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>Tous les statuts</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <CreateOrderDialog />
        </>
      }
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
    </div>
  )
}
