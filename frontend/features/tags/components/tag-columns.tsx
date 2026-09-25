"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DeleteTagDialog } from "@/features/tags/components/delete-tag-dialog"
import { EditTagDialog } from "@/features/tags/components/edit-tag-dialog"
import type { Tag } from "@/features/tags/types"

export const tagColumns: ColumnDef<Tag>[] = [
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
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <EditTagDialog tag={row.original} />
        <DeleteTagDialog tag={row.original} />
      </div>
    ),
  },
]
