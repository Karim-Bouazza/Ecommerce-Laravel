"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatPrice } from "@/shared/lib/format-price"
import { UpdateStockDialog } from "@/features/stock/components/update-stock-dialog"
import type { StockItem } from "@/features/stock/types"

export function getStockColumns(warehouseId: number): ColumnDef<StockItem>[] {
  return [
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
      accessorKey: "stock_interne",
      header: "Stock interne",
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <span>{row.original.stock_interne}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.stock_reserve} Réservé
          </span>
        </div>
      ),
    },
    {
      accessorKey: "stock_en_livraison",
      header: "Stock en livraison",
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <span>{row.original.stock_en_livraison}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.stock_en_retour} En retour
          </span>
        </div>
      ),
    },
    {
      id: "stock_manquant",
      header: "Stock manquant",
      cell: () => (
        <div className="flex flex-col items-center">
          <span>0</span>
          <span className="text-xs text-muted-foreground">(bientôt)</span>
        </div>
      ),
    },
    {
      accessorKey: "confirme_sans_stock",
      header: "Confirmé sans stock",
    },
    {
      accessorKey: "vendu",
      header: "Vendu",
    },
    {
      accessorKey: "purchase_price",
      header: "Prix d'achat",
      cell: ({ row }) =>
        formatPrice(row.original.purchase_price) ?? <span className="text-muted-foreground">—</span>,
    },
    {
      accessorKey: "valeur_du_stock",
      header: "Valeur du stock",
      cell: ({ row }) =>
        formatPrice(row.original.valeur_du_stock) ?? <span className="text-muted-foreground">—</span>,
    },
    {
      accessorKey: "valeur_en_livraison",
      header: "Valeur en livraison",
      cell: ({ row }) => formatPrice(row.original.valeur_en_livraison),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <UpdateStockDialog product={row.original} warehouseId={warehouseId} />
        </div>
      ),
      meta: { sticky: "right", stickyWidth: 72, className: "min-w-[72px]" },
    },
  ]
}
