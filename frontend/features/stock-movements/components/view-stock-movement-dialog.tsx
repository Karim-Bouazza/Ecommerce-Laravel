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
import type { StockMovement } from "@/features/stock-movements/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "medium",
})

type ViewStockMovementDialogProps = {
  movement: StockMovement
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function ViewStockMovementDialog({ movement }: ViewStockMovementDialogProps) {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du mouvement de stock</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <DetailField label="Nom du produit" value={movement.product_name ?? "—"} />
          <DetailField label="Entrepôt" value={movement.warehouse.name} />
          <DetailField label="Type" value={movement.type_label} />
          <DetailField
            label="Quantité"
            value={`${movement.signed_quantity > 0 ? "+" : ""}${movement.signed_quantity}`}
          />
          <DetailField label="Stock interne résultant" value={movement.resulting_quantity} />
          <DetailField label="Éditeur" value={movement.creator_name ?? "—"} />
          <DetailField label="Date de création" value={dateFormatter.format(new Date(movement.created_at))} />
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
