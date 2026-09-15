"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DeletePaiementDialog } from "@/features/paiements/components/delete-paiement-dialog"
import { EditPaiementDialog } from "@/features/paiements/components/edit-paiement-dialog"
import type { Paiement } from "@/features/paiements/types"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} DZD`
}

export const paiementColumns: ColumnDef<Paiement>[] = [
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
    accessorKey: "delivery_partner_name",
    header: "Partenaire de livraison",
    cell: ({ row }) =>
      row.original.delivery_partner_name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <EditPaiementDialog paiement={row.original} />
        <DeletePaiementDialog paiement={row.original} />
      </div>
    ),
  },
]
