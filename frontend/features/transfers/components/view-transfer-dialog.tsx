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
import type { Transfer } from "@/features/transfers/types"

type ViewTransferDialogProps = {
  transfer: Transfer
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function ViewTransferDialog({ transfer }: ViewTransferDialogProps) {
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
          <DialogTitle>Détails du transfert — {transfer.reference}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="De" value={transfer.from_warehouse.name} />
            <DetailField label="À" value={transfer.to_warehouse.name} />
            <DetailField label="Statut" value={transfer.status_label} />
            <DetailField
              label="Remarque"
              value={transfer.remark || <span className="text-muted-foreground">—</span>}
            />
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du produit</TableHead>
                  <TableHead>Quantité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfer.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Aucun produit.
                    </TableCell>
                  </TableRow>
                ) : (
                  transfer.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name ?? "—"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
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
