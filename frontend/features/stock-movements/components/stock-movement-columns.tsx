"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "cn"

import { ViewStockMovementDialog } from "@/features/stock-movements/components/view-stock-movement-dialog"
import type { StockMovement } from "@/features/stock-movements/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "medium",
})

const typeBadgeClasses: Record<StockMovement["type_color"], string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export const stockMovementColumns: ColumnDef<StockMovement>[] = [
  {
    accessorKey: "created_at",
    header: "Date de création",
    cell: ({ row }) => dateFormatter.format(new Date(row.original.created_at)),
  },
  {
    id: "product_name",
    header: "Nom du produit",
    cell: ({ row }) => row.original.product_name ?? "—",
  },
  {
    accessorKey: "quantity",
    header: "Quantité",
    cell: ({ row }) => {
      const value = row.original.signed_quantity
      return `${value > 0 ? "+" : ""}${value}`
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          typeBadgeClasses[row.original.type_color]
        )}
      >
        {row.original.type_label}
      </span>
    ),
  },
  {
    id: "stock_interne",
    header: "Stock interne",
    cell: () => (
      <div className="flex flex-col items-center">
        <span>0</span>
        <span className="text-xs text-muted-foreground">(bientôt)</span>
      </div>
    ),
  },
  {
    id: "stock_en_livraison",
    header: "Stock en livraison",
    cell: () => (
      <div className="flex flex-col items-center">
        <span>0</span>
        <span className="text-xs text-muted-foreground">(bientôt)</span>
      </div>
    ),
  },
  {
    id: "vendu",
    header: "Vendu",
    cell: () => (
      <div className="flex flex-col items-center">
        <span>0</span>
        <span className="text-xs text-muted-foreground">(bientôt)</span>
      </div>
    ),
  },
  {
    id: "creator_name",
    header: "Éditeur",
    cell: ({ row }) => row.original.creator_name ?? "—",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <ViewStockMovementDialog movement={row.original} />
      </div>
    ),
  },
]
