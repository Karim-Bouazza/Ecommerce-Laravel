"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "cn"

import { formatPrice } from "@/shared/lib/format-price"
import { ConfirmPurchaseEntryDialog } from "@/features/purchase-entries/components/confirm-purchase-entry-dialog"
import { CreatePurchaseEntryVersementDialog } from "@/features/purchase-entries/components/create-purchase-entry-versement-dialog"
import { DeletePurchaseEntryDialog } from "@/features/purchase-entries/components/delete-purchase-entry-dialog"
import { EditPurchaseEntryDialog } from "@/features/purchase-entries/components/edit-purchase-entry-dialog"
import { PurchaseEntryVersementHistoryDialog } from "@/features/purchase-entries/components/purchase-entry-versement-history-dialog"
import { ViewPurchaseEntryDialog } from "@/features/purchase-entries/components/view-purchase-entry-dialog"
import type { PurchaseEntry } from "@/features/purchase-entries/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "medium",
})

const statusBadgeClasses: Record<PurchaseEntry["status_color"], string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export const purchaseEntryColumns: ColumnDef<PurchaseEntry>[] = [
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
        <ViewPurchaseEntryDialog entry={row.original} />
        {row.original.status === "pending" && (
          <>
            <ConfirmPurchaseEntryDialog entry={row.original} />
            <EditPurchaseEntryDialog entry={row.original} />
          </>
        )}
        {row.original.status === "pending" && row.original.payment_status === "unpaid" && (
          <DeletePurchaseEntryDialog entry={row.original} />
        )}
        {row.original.status !== "pending" && row.original.remaining_amount > 0 && (
          <CreatePurchaseEntryVersementDialog entry={row.original} />
        )}
        {row.original.paid_amount > 0 && <PurchaseEntryVersementHistoryDialog entry={row.original} />}
      </div>
    ),
  },
]
