"use client"

import * as React from "react"
import { History } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/shared/lib/format-price"
import { useReturnEntryVersements } from "@/features/return-entries/hooks/use-return-entry-versements"
import type { ReturnEntry } from "@/features/return-entries/types"

type ReturnEntryVersementHistoryDialogProps = {
  entry: ReturnEntry
}

export function ReturnEntryVersementHistoryDialog({ entry }: ReturnEntryVersementHistoryDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { data: versements = [], isPending } = useReturnEntryVersements(entry.id, open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Historique des paiements"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <History className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historique des paiements — {entry.reference}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">FOURNISSEUR</p>
              <p className="font-heading text-sm font-semibold">{entry.fournisseur.name}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">TOTAL</p>
              <p className="font-heading text-sm font-semibold">{formatPrice(entry.total)}</p>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">PAYÉ</p>
              <p className="font-heading text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {formatPrice(entry.paid_amount)}
              </p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
              <p className="text-xs text-amber-600 dark:text-amber-400">RESTANT</p>
              <p className="font-heading text-sm font-semibold text-amber-600 dark:text-amber-400">
                {formatPrice(entry.remaining_amount)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Portefeuille</TableHead>
                  <TableHead>Remarque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Chargement…
                    </TableCell>
                  </TableRow>
                ) : versements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Aucun paiement.
                    </TableCell>
                  </TableRow>
                ) : (
                  versements.map((versement, index) => (
                    <TableRow key={versement.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{versement.reference}</TableCell>
                      <TableCell>{versement.date}</TableCell>
                      <TableCell className="font-medium">{formatPrice(versement.amount)}</TableCell>
                      <TableCell>{versement.wallet_name ?? "—"}</TableCell>
                      <TableCell>{versement.remark || "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
