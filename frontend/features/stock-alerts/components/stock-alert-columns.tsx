"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { StockAlertItem } from "@/features/stock-alerts/types"

export const stockAlertColumns: ColumnDef<StockAlertItem>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) =>
      row.original.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.original.image}
          alt={row.original.name}
          className="mx-auto size-10 rounded-md object-cover"
        />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "name",
    header: "Nom du produit",
  },
  {
    accessorKey: "stock_minimum",
    header: "Stock minimum",
    cell: ({ row }) => <div className="text-center">{row.original.stock_minimum}</div>,
  },
  {
    accessorKey: "stock_interne",
    header: "Stock interne",
    cell: ({ row }) => (
      <div className="flex flex-col items-center">
        <span className="font-semibold text-destructive">{row.original.stock_interne}</span>
        <span className="text-xs text-muted-foreground">{row.original.stock_reserve} Réservé</span>
      </div>
    ),
  },
  {
    accessorKey: "vendu",
    header: "Vendu",
    cell: ({ row }) => <div className="text-center">{row.original.vendu}</div>,
  },
  {
    accessorKey: "stock_en_livraison",
    header: "Stock en livraison",
    cell: ({ row }) => (
      <div className="flex flex-col items-center">
        <span>{row.original.stock_en_livraison}</span>
        <span className="text-xs text-muted-foreground">{row.original.stock_en_retour} En retour</span>
      </div>
    ),
  },
]
