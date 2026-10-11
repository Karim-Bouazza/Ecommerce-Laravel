"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useAbility } from "@/features/auth/lib/ability-provider"
import { administratorColumns } from "@/features/administrators/components/administrator-columns"
import { CreateAdministratorDialog } from "@/features/administrators/components/create-administrator-dialog"
import { useAdministratorRoleOptions } from "@/features/administrators/hooks/use-administrator-role-options"
import { useAdministrators } from "@/features/administrators/hooks/use-administrators"
import type { AdministratorStatusFilter } from "@/features/administrators/types"

const ALL = "all"

const statusOptions: { value: string; label: string }[] = [
  { value: ALL, label: "Tous les statuts" },
  { value: "active", label: "Actifs" },
  { value: "inactive", label: "Inactifs" },
]

export function AdministratorsTable() {
  const ability = useAbility()
  const [search, setSearch] = React.useState("")
  const [roleId, setRoleId] = React.useState(ALL)
  const [status, setStatus] = React.useState(ALL)
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  const debouncedSearch = useDebouncedValue(search)
  const { data: roles = [] } = useAdministratorRoleOptions()

  // Any filter change goes back to the first page.
  const changeFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  const { data, isPending, isFetching, refetch } = useAdministrators({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    role_id: roleId === ALL ? undefined : Number(roleId),
    status: status === ALL ? undefined : (status as AdministratorStatusFilter),
  })

  const roleItems = [{ value: ALL, label: "Tous les rôles" }, ...roles.map((role) => ({ value: String(role.id), label: role.name }))]

  return (
    <DataTable
      columns={administratorColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun administrateur."
      search={{
        value: search,
        onChange: changeFilter(setSearch),
        placeholder: "Rechercher nom, email ou téléphone",
      }}
      onRefresh={() => refetch()}
      toolbarActions={
        <>
          <Select value={roleId} onValueChange={(value) => changeFilter(setRoleId)(value ?? ALL)}>
            <SelectTrigger className="w-40" aria-label="Filtrer par rôle">
              <SelectValue>{(value: string) => roleItems.find((item) => item.value === value)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {roleItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(value) => changeFilter(setStatus)(value ?? ALL)}>
            <SelectTrigger className="w-40" aria-label="Filtrer par statut">
              <SelectValue>{(value: string) => statusOptions.find((item) => item.value === value)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {ability.can("create", "administrateurs") ? <CreateAdministratorDialog /> : null}
        </>
      }
      pagination={{
        pageIndex: data?.meta.current_page ?? page,
        pageCount: data?.meta.last_page ?? 1,
        pageSize: perPage,
        total: data?.meta.total ?? 0,
        onPageIndexChange: setPage,
        onPageSizeChange: changeFilter(setPerPage),
      }}
      className={isFetching ? "opacity-70 transition-opacity" : undefined}
    />
  )
}
