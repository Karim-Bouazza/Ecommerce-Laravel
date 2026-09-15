"use client"

import * as React from "react"
import { Info } from "lucide-react"

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
import type { ReturnEntry } from "@/features/return-entries/types"

type ViewReturnEntryDialogProps = {
  entry: ReturnEntry
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function ViewReturnEntryDialog({ entry }: ViewReturnEntryDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Détails"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du retour — {entry.reference}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Entrée d'achat" value={entry.purchase_entry.reference} />
            <DetailField label="Entrepôt" value={entry.warehouse.name} />
            <DetailField label="Fournisseur" value={entry.fournisseur.name} />
            <DetailField
              label="Remarque"
              value={entry.remark || <span className="text-muted-foreground">—</span>}
            />
            <DetailField label="Total" value={formatPrice(entry.total)} />
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix d&rsquo;achat</TableHead>
                  <TableHead>Sous-total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aucun produit.
                    </TableCell>
                  </TableRow>
                ) : (
                  entry.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name ?? "—"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatPrice(item.purchase_price)}</TableCell>
                      <TableCell className="font-medium">{formatPrice(item.subtotal)}</TableCell>
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
