"use client"

import type { ColumnDef } from "@tanstack/react-table"

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
]
