"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "cn"

import { ConfirmTransferDialog } from "@/features/transfers/components/confirm-transfer-dialog"
import { DeleteTransferDialog } from "@/features/transfers/components/delete-transfer-dialog"
import { ViewTransferDialog } from "@/features/transfers/components/view-transfer-dialog"
import type { Transfer } from "@/features/transfers/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "medium",
})

const statusBadgeClasses: Record<Transfer["status_color"], string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

const typeBadgeClasses: Record<"in" | "out", string> = {
  in: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  out: "bg-destructive/10 text-destructive",
}

const typeLabels: Record<"in" | "out", string> = {
  in: "IN",
  out: "OUT",
}

export function getTransferColumns(viewingWarehouseId: number | null): ColumnDef<Transfer>[] {
  const columns: ColumnDef<Transfer>[] = [
    {
      accessorKey: "reference",
      header: "Ref",
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => dateFormatter.format(new Date(row.original.created_at)),
    },
  ]

  if (viewingWarehouseId !== null) {
    columns.push({
      id: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type
        if (!type) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              typeBadgeClasses[type]
            )}
          >
            {typeLabels[type]}
          </span>
        )
      },
    })
  }

  columns.push(
    {
      id: "from_warehouse",
      header: "De",
      cell: ({ row }) => row.original.from_warehouse.name,
    },
    {
      id: "to_warehouse",
      header: "À",
      cell: ({ row }) => row.original.to_warehouse.name,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            statusBadgeClasses[row.original.status_color]
          )}
        >
          {row.original.status_label}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <ViewTransferDialog transfer={row.original} />
          {row.original.status === "pending" && (
            <>
              <ConfirmTransferDialog transfer={row.original} />
              <DeleteTransferDialog transfer={row.original} />
            </>
          )}
        </div>
      ),
    }
  )

  return columns
}
