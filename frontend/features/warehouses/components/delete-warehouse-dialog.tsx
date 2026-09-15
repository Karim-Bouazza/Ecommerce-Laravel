"use client"

import * as React from "react"
import { HelpCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDeleteWarehouse } from "@/features/warehouses/hooks/use-delete-warehouse"
import type { Warehouse } from "@/features/warehouses/types"

type DeleteWarehouseDialogProps = {
  warehouse: Warehouse
}

export function DeleteWarehouseDialog({ warehouse }: DeleteWarehouseDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useDeleteWarehouse(warehouse.id, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Supprimer"
            className="text-destructive hover:text-destructive"
          />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer l&rsquo;entrepôt</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          {warehouse.has_related_data && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Cet entrepôt contient des transferts, des entrées de stock ou des produits. Le
              supprimer entraînera la suppression définitive de l&rsquo;entrepôt ainsi que toutes
              ses données associées.
            </p>
          )}

          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HelpCircle className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">
              Ceci supprimera définitivement l&rsquo;entrepôt et ses données associées.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Non
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? "Suppression…" : "Oui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
