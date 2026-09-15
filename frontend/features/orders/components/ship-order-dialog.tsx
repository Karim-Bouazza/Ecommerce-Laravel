"use client"

import * as React from "react"
import { Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status"
import type { Order } from "@/features/orders/types"

const SHIPPED_STATUS = "shipped"

type ShipOrderDialogProps = {
  order: Order
}

export function ShipOrderDialog({ order }: ShipOrderDialogProps) {
  const [open, setOpen] = React.useState(false)
  const mutation = useUpdateOrderStatus()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Marquer en cours de livraison"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <Truck className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmer la commande</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr ? Ceci appliquera l&apos;action sélectionnée à cette commande.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Non
          </Button>
          <Button
            type="button"
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate(
                { id: order.id, status: SHIPPED_STATUS },
                { onSuccess: () => setOpen(false) }
              )
            }
          >
            {mutation.isPending ? "Envoi…" : "Oui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
