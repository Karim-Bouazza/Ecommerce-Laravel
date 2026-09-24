"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { chargeColumns, recurringChargeColumns } from "@/features/charges/components/charge-columns"
import { ChargeFiltersSheet, type ChargeFiltersValue } from "@/features/charges/components/charge-filters-sheet"
import { useCharges } from "@/features/charges/hooks/use-charges"

function ChargesTabTable({ tab }: { tab: "charges" | "recurring" }) {
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<ChargeFiltersValue>({})
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters, perPage])

  const { data, isPending, isFetching, refetch } = useCharges({
    tab,
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    ...filters,
  })

  return (
    <DataTable
      columns={tab === "recurring" ? recurringChargeColumns : chargeColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage={tab === "recurring" ? "Aucune charge récurrente." : "Aucune charge."}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher…",
      }}
      toolbarActions={<ChargeFiltersSheet value={filters} onApply={setFilters} />}
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
  )
}

export function ChargesTable() {
  return (
    <Tabs defaultValue="charges">
      <TabsList>
        <TabsTab value="charges">Charges</TabsTab>
        <TabsTab value="recurring">Charges Récurrentes</TabsTab>
      </TabsList>

      <TabsPanel value="charges">
        <ChargesTabTable tab="charges" />
      </TabsPanel>
      <TabsPanel value="recurring">
        <ChargesTabTable tab="recurring" />
      </TabsPanel>
    </Tabs>
  )
}
