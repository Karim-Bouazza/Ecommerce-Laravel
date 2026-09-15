"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { deliveryCompanyColumns } from "@/features/partners/components/delivery-company-columns"
import { useDeliveryCompanyIntegrations } from "@/features/partners/hooks/use-delivery-company-integrations"

export function DeliveryCompaniesTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useDeliveryCompanyIntegrations()

  const filtered = React.useMemo(() => {
    const companies = data ?? []
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return companies

    return companies.filter(
      (company) =>
        company.entreprise.toLowerCase().includes(query) ||
        company.name?.toLowerCase().includes(query)
    )
  }, [data, debouncedSearch])

  const pageCount = Math.max(Math.ceil(filtered.length / perPage), 1)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <DataTable
      columns={deliveryCompanyColumns}
      data={paginated}
      isLoading={isPending}
      emptyMessage="Aucune entreprise de livraison."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher entreprise",
      }}
      onRefresh={() => refetch()}
      pagination={{
        pageIndex: page,
        pageCount,
        pageSize: perPage,
        total: filtered.length,
        onPageIndexChange: setPage,
        onPageSizeChange: setPerPage,
      }}
      className={isFetching ? "opacity-70 transition-opacity" : undefined}
    />
  )
}
