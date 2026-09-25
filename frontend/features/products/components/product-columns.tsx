"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { cn } from "cn"
import { formatPrice } from "@/shared/lib/format-price"
import { DeleteProductDialog } from "@/features/products/components/delete-product-dialog"
import { EditProductDialog } from "@/features/products/components/edit-product-dialog"
import { ViewProductDialog } from "@/features/products/components/view-product-dialog"
import type { Product } from "@/features/products/types"

export const productColumns: ColumnDef<Product>[] = [
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
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => row.original.category ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "brand",
    header: "Marque",
    cell: ({ row }) => row.original.brand ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => row.original.sku ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "purchase_price",
    header: "Prix d'achat (DZD)",
    cell: ({ row }) => formatPrice(row.original.purchase_price) ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "price",
    header: "Prix de vente (DZD)",
    cell: ({ row }) => formatPrice(row.original.price) ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "is_active",
    header: "Actif",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          row.original.is_active
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-destructive/10 text-destructive"
        )}
      >
        {row.original.is_active ? "Actif" : "Inactif"}
      </span>
    ),
  },
  {
    accessorKey: "is_new",
    header: "Nouveau",
    cell: ({ row }) =>
      row.original.is_new ? (
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          Nouveau
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <ViewProductDialog product={row.original} />
        <EditProductDialog product={row.original} />
        <DeleteProductDialog product={row.original} />
      </div>
    ),
  },
]
