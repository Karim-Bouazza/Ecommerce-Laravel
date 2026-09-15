"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DeleteVersementDialog } from "@/features/versements/components/delete-versement-dialog"
import { EditVersementDialog } from "@/features/versements/components/edit-versement-dialog"
import type { Versement } from "@/features/versements/types"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} DZD`
}

export const versementColumns: ColumnDef<Versement>[] = [
  {
    accessorKey: "reference",
    header: "Ref",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "creator_name",
    header: "Créateur",
    cell: ({ row }) =>
      row.original.creator_name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "wallet_name",
    header: "Portefeuille",
    cell: ({ row }) => row.original.wallet_name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "amount",
    header: "Montant (DZD)",
    cell: ({ row }) => formatAmount(row.original.amount),
  },
  {
    accessorKey: "type_label",
    header: "Type de versement",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
        {row.original.type_label}
      </span>
    ),
  },
  {
    accessorKey: "fournisseur_name",
    header: "Bénéficiaire",
    cell: ({ row }) =>
      row.original.fournisseur_name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <EditVersementDialog versement={row.original} />
        <DeleteVersementDialog versement={row.original} />
      </div>
    ),
  },
]
