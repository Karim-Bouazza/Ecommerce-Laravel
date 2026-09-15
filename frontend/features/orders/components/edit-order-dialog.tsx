"use client"

import * as React from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { OrderFormFields } from "@/features/orders/components/order-form-fields"
import { buildOrderFormDefaults, useUpdateOrder } from "@/features/orders/hooks/use-update-order"
import type { Order } from "@/features/orders/types"

type EditOrderDialogProps = {
  order: Order
}

export function EditOrderDialog({ order }: EditOrderDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateOrder(order, () => setOpen(false))

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) form.reset(buildOrderFormDefaults(order))
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Modifier"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier la commande — {order.reference}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <OrderFormFields form={form} idPrefix={`edit-order-${order.id}`} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
