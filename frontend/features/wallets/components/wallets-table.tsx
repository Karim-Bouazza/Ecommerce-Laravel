"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateTransferDialog } from "@/features/wallets/components/create-transfer-dialog"
import { CreateWalletDialog } from "@/features/wallets/components/create-wallet-dialog"
import { walletColumns } from "@/features/wallets/components/wallet-columns"
import { useWallets } from "@/features/wallets/hooks/use-wallets"

export function WalletsTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useWallets({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={walletColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun portefeuille."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher nom",
      }}
      onRefresh={() => refetch()}
      toolbarActions={
        <>
          <CreateTransferDialog />
          <CreateWalletDialog />
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
  )
}
