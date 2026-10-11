"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { cn } from "cn"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAbility } from "@/features/auth/lib/ability-provider"
import { getInitials } from "@/features/auth/lib/get-initials"
import { DeleteAdministratorDialog } from "@/features/administrators/components/delete-administrator-dialog"
import { EditAdministratorDialog } from "@/features/administrators/components/edit-administrator-dialog"
import { ToggleAdministratorActiveDialog } from "@/features/administrators/components/toggle-administrator-active-dialog"
import type { Administrator } from "@/features/administrators/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" })

function AdministratorActions({ administrator }: { administrator: Administrator }) {
  const ability = useAbility()

  return (
    <div className="flex items-center justify-center gap-1">
      {ability.can("edit", "administrateurs") ? (
        <>
          <EditAdministratorDialog administrator={administrator} />
          <ToggleAdministratorActiveDialog administrator={administrator} />
        </>
      ) : null}
      {ability.can("delete", "administrateurs") ? (
        <DeleteAdministratorDialog administrator={administrator} />
      ) : null}
    </div>
  )
}

export const administratorColumns: ColumnDef<Administrator>[] = [
  {
    accessorKey: "name",
    header: "Administrateur",
    meta: { align: "left" },
    cell: ({ row }) => {
      const administrator = row.original

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            {administrator.avatar ? <AvatarImage src={administrator.avatar} alt="" /> : null}
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(administrator.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="flex items-center gap-2 truncate font-medium">
              {administrator.name}
              {administrator.is_current ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  Vous
                </span>
              ) : null}
            </span>
            <span className="truncate text-xs text-muted-foreground">{administrator.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => row.original.phone ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "role",
    header: "Rôle",
    cell: ({ row }) =>
      row.original.role ? (
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
          {row.original.role.name}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          row.original.is_active
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-destructive/10 text-destructive"
        )}
      >
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full", row.original.is_active ? "bg-emerald-500" : "bg-destructive")}
        />
        {row.original.is_active ? "Actif" : "Inactif"}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Créé le",
    cell: ({ row }) =>
      row.original.created_at ? (
        <span className="tabular-nums">{dateFormatter.format(new Date(row.original.created_at))}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <AdministratorActions administrator={row.original} />,
  },
]
