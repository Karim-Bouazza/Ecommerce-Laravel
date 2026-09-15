"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { cn } from "cn"
import type { WalletTransaction } from "@/features/wallets/types"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} DZD`
}

const categoryBadgeClasses: Record<WalletTransaction["category_color"], string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export const transactionColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "reference",
    header: "Ref",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "creator_name",
    header: "Créateur",
    cell: ({ row }) =>
      row.original.creator_name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "amount",
    header: "Montant (DZD)",
    cell: ({ row }) => formatAmount(row.original.amount),
  },
  {
    accessorKey: "remark",
    header: "Remarque",
    cell: ({ row }) => row.original.remark ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "category_label",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          categoryBadgeClasses[row.original.category_color]
        )}
      >
        {row.original.category_label}
      </span>
    ),
  },
]
