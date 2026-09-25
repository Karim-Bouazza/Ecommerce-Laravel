"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { cn } from "cn"
import { DeleteBrandDialog } from "@/features/brands/components/delete-brand-dialog"
import { EditBrandDialog } from "@/features/brands/components/edit-brand-dialog"
import { ToggleBrandActiveDialog } from "@/features/brands/components/toggle-brand-active-dialog"
import type { Brand } from "@/features/brands/types"

export const brandColumns: ColumnDef<Brand>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "products_count",
    header: "Produits",
    cell: ({ row }) => row.original.products_count,
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
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <EditBrandDialog brand={row.original} />
        <ToggleBrandActiveDialog brand={row.original} />
        <DeleteBrandDialog brand={row.original} />
      </div>
    ),
  },
]
