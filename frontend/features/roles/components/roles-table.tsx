"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CreateRoleDialog } from "@/features/roles/components/create-role-dialog"
import { roleColumns } from "@/features/roles/components/role-columns"
import { useRoles } from "@/features/roles/hooks/use-roles"

export function RolesTable() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, perPage])

  const { data, isPending, isFetching, refetch } = useRoles({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
  })

  return (
    <DataTable
      columns={roleColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun rôle."
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher le nom",
      }}
      onRefresh={() => refetch()}
      toolbarActions={<CreateRoleDialog />}
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
