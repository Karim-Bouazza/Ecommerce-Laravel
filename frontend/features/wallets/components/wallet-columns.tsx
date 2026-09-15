"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DeleteWalletDialog } from "@/features/wallets/components/delete-wallet-dialog"
import { DepositToWalletDialog } from "@/features/wallets/components/deposit-to-wallet-dialog"
import { EditWalletDialog } from "@/features/wallets/components/edit-wallet-dialog"
import { WithdrawFromWalletDialog } from "@/features/wallets/components/withdraw-from-wallet-dialog"
import type { Wallet } from "@/features/wallets/types"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} DZD`
}

export const walletColumns: ColumnDef<Wallet>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "balance",
    header: "Solde",
    cell: ({ row }) => formatAmount(row.original.balance),
  },
  {
    accessorKey: "entries_sum_amount",
    header: "Entrée",
    cell: ({ row }) => (
      <span className="text-emerald-600 dark:text-emerald-400">
        {formatAmount(row.original.entries_sum_amount)}
      </span>
    ),
  },
  {
    accessorKey: "exits_sum_amount",
    header: "Sortie",
    cell: ({ row }) => (
      <span className="text-destructive">{formatAmount(row.original.exits_sum_amount)}</span>
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
        <EditWalletDialog wallet={row.original} />
        <DepositToWalletDialog wallet={row.original} />
        <WithdrawFromWalletDialog wallet={row.original} />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Transactions"
          className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          nativeButton={false}
          render={<Link href={`/admin/finances/wallets/transactions?walletId=${row.original.id}`} />}
        >
          <List className="size-4" />
        </Button>
        <DeleteWalletDialog wallet={row.original} />
      </div>
    ),
  },
]
