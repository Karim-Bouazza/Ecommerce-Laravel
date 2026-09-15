"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowLeftRight } from "lucide-react"
import Link from "next/link"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { DeleteWarehouseDialog } from "@/features/warehouses/components/delete-warehouse-dialog"
import { EditWarehouseDialog } from "@/features/warehouses/components/edit-warehouse-dialog"
import { ToggleWarehouseActiveDialog } from "@/features/warehouses/components/toggle-warehouse-active-dialog"
import type { Warehouse } from "@/features/warehouses/types"

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

export const warehouseColumns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => row.original.phone ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) => row.original.address ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "all_wilayas",
    header: "Toutes les wilayas",
    cell: ({ row }) => <BooleanBadge value={row.original.all_wilayas} trueLabel="OUI" falseLabel="NON" />,
  },
  {
    accessorKey: "all_products",
    header: "Tous les produits",
    cell: ({ row }) => <BooleanBadge value={row.original.all_products} trueLabel="OUI" falseLabel="NON" />,
  },
  {
    accessorKey: "remark",
    header: "Remarque",
    cell: ({ row }) => row.original.remark ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "active",
    header: "Actif",
    cell: ({ row }) => <BooleanBadge value={row.original.active} trueLabel="Actif" falseLabel="Inactif" />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Transférer"
          nativeButton={false}
          render={<Link href={`/admin/inventory/transfers?warehouse_id=${row.original.id}`} />}
        >
          <ArrowLeftRight className="size-4" />
        </Button>
        <EditWarehouseDialog warehouse={row.original} />
        <ToggleWarehouseActiveDialog warehouse={row.original} />
        <DeleteWarehouseDialog warehouse={row.original} />
      </div>
    ),
  },
]
