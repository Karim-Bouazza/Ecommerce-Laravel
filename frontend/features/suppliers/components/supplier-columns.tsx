"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatPrice } from "@/shared/lib/format-price"
import { DeleteSupplierDialog } from "@/features/suppliers/components/delete-supplier-dialog"
import { EditSupplierDialog } from "@/features/suppliers/components/edit-supplier-dialog"
import type { Supplier } from "@/features/suppliers/types"

export const supplierColumns: ColumnDef<Supplier>[] = [
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
    accessorKey: "total_dues",
    header: "Total des dues",
    cell: ({ row }) => formatPrice(row.original.total_dues),
  },
  {
    accessorKey: "total_paid",
    header: "Montant payé",
    cell: ({ row }) => (
      <span className="text-emerald-600 dark:text-emerald-400">
        {formatPrice(row.original.total_paid)}
      </span>
    ),
  },
  {
    accessorKey: "remaining_amount",
    header: "Montant restant",
    cell: ({ row }) => (
      <span className={row.original.remaining_amount > 0 ? "text-destructive" : undefined}>
        {formatPrice(row.original.remaining_amount)}
      </span>
    ),
  },
  {
    accessorKey: "remark",
    header: "Remarque",
    cell: ({ row }) => row.original.remark ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <EditSupplierDialog supplier={row.original} />
        <DeleteSupplierDialog supplier={row.original} />
      </div>
    ),
  },
]
