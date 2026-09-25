"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { cn } from "cn"
import { DeletePixelDialog } from "@/features/pixels/components/delete-pixel-dialog"
import { EditPixelDialog } from "@/features/pixels/components/edit-pixel-dialog"
import { TogglePixelActiveDialog } from "@/features/pixels/components/toggle-pixel-active-dialog"
import { pixelProviderLabel } from "@/features/pixels/constants/pixel-providers"
import type { Pixel } from "@/features/pixels/types"

export const pixelColumns: ColumnDef<Pixel>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "provider",
    header: "Fournisseur",
    cell: ({ row }) => pixelProviderLabel(row.original.provider),
  },
  {
    accessorKey: "pixel_id",
    header: "ID du pixel",
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
        <EditPixelDialog pixel={row.original} />
        <TogglePixelActiveDialog pixel={row.original} />
        <DeletePixelDialog pixel={row.original} />
      </div>
    ),
  },
]
