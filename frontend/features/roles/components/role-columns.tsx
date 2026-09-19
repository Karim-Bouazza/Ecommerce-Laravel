"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DeleteRoleDialog } from "@/features/roles/components/delete-role-dialog"
import { EditRoleDialog } from "@/features/roles/components/edit-role-dialog"
import { ViewRoleDialog } from "@/features/roles/components/view-role-dialog"
import type { Role } from "@/features/roles/types"

export const roleColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Rôle",
    meta: { align: "left" },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => (
      <div className="flex flex-wrap justify-center gap-1.5">
        {row.original.permissions.map((permission) => (
          <span
            key={permission}
            className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {permission}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <ViewRoleDialog role={row.original} />
        <EditRoleDialog role={row.original} />
        <DeleteRoleDialog role={row.original} />
      </div>
    ),
  },
]
