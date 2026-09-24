"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { cn } from "cn"
import { DeleteCategoryDialog } from "@/features/categories/components/delete-category-dialog"
import { EditCategoryDialog } from "@/features/categories/components/edit-category-dialog"
import { ToggleCategoryActiveDialog } from "@/features/categories/components/toggle-category-active-dialog"
import type { Category } from "@/features/categories/types"

function BooleanBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        value
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-destructive/10 text-destructive"
      )}
    >
      {value ? trueLabel : falseLabel}
    </span>
  )
}

export const categoryColumns: ColumnDef<Category>[] = [
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
    cell: ({ row }) => <BooleanBadge value={row.original.is_active} trueLabel="Actif" falseLabel="Inactif" />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <EditCategoryDialog category={row.original} />
        <ToggleCategoryActiveDialog category={row.original} />
        <DeleteCategoryDialog category={row.original} />
      </div>
    ),
  },
]
