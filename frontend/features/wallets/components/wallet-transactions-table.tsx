"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { transactionColumns } from "@/features/wallets/components/transaction-columns"
import { useWalletTransactions } from "@/features/wallets/hooks/use-wallet-transactions"
import type { WalletTransactionCategory } from "@/features/wallets/types"

const tabs: { value: WalletTransactionCategory | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "withdrawal", label: "Retrait" },
  { value: "deposit", label: "Dépôt" },
  { value: "versement", label: "Versement" },
  { value: "payment", label: "Paiement" },
]

export function WalletTransactionsTable({ walletId }: { walletId: number }) {
  const [category, setCategory] = React.useState<WalletTransactionCategory | "all">("all")
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [category, debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useWalletTransactions(walletId, {
    page,
    per_page: perPage,
    category,
    search: debouncedSearch || undefined,
  })

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={category}
        onValueChange={(value) => setCategory(value as WalletTransactionCategory | "all")}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTab key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>

      <DataTable
        columns={transactionColumns}
        data={data?.data ?? []}
        isLoading={isPending}
        emptyMessage="Aucune transaction."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher nom",
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
    </div>
  )
}
