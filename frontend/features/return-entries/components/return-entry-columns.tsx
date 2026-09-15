"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "cn"

import { formatPrice } from "@/shared/lib/format-price"
import { ConfirmReturnEntryDialog } from "@/features/return-entries/components/confirm-return-entry-dialog"
import { CreateReturnEntryVersementDialog } from "@/features/return-entries/components/create-return-entry-versement-dialog"
import { DeleteReturnEntryDialog } from "@/features/return-entries/components/delete-return-entry-dialog"
import { EditReturnEntryDialog } from "@/features/return-entries/components/edit-return-entry-dialog"
import { ReturnEntryVersementHistoryDialog } from "@/features/return-entries/components/return-entry-versement-history-dialog"
import { ViewReturnEntryDialog } from "@/features/return-entries/components/view-return-entry-dialog"
import type { ReturnEntry } from "@/features/return-entries/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "medium",
})

const statusBadgeClasses: Record<ReturnEntry["status_color"], string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export const returnEntryColumns: ColumnDef<ReturnEntry>[] = [
  {
    accessorKey: "reference",
    header: "Ref",
  },
  {
    accessorKey: "created_at",
    header: "Date de création",
    cell: ({ row }) => dateFormatter.format(new Date(row.original.created_at)),
  },
  {
    id: "warehouse",
    header: "Entrepôt",
    cell: ({ row }) => row.original.warehouse.name,
  },
  {
    id: "fournisseur",
    header: "Fournisseur",
    cell: ({ row }) => row.original.fournisseur.name,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatPrice(row.original.total),
  },
  {
    accessorKey: "payment_status",
    header: "Statut de paiement",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          statusBadgeClasses[row.original.payment_status_color]
        )}
      >
        {row.original.payment_status_label}
      </span>
    ),
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
        <ViewReturnEntryDialog entry={row.original} />
        {row.original.status === "pending" && (
          <>
            <ConfirmReturnEntryDialog entry={row.original} />
            <EditReturnEntryDialog entry={row.original} />
            <DeleteReturnEntryDialog entry={row.original} />
          </>
        )}
        {row.original.status !== "pending" && row.original.remaining_amount > 0 && (
          <CreateReturnEntryVersementDialog entry={row.original} />
        )}
        {row.original.paid_amount > 0 && <ReturnEntryVersementHistoryDialog entry={row.original} />}
      </div>
    ),
  },
]
