"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status"
import type { Order } from "@/features/orders/types"

const REPORTED_STATUS = "reported"

type ReportOrderDialogProps = {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportOrderDialog({ order, open, onOpenChange }: ReportOrderDialogProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const mutation = useUpdateOrderStatus()

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) setDate(undefined)
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Reporter la commande</DialogTitle>
          <DialogDescription>
            Choisissez la date à laquelle cette commande doit être reprise.
          </DialogDescription>
        </DialogHeader>

        <DatePicker value={date} onChange={setDate} placeholder="Date de report" />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            disabled={!date || mutation.isPending}
            onClick={() =>
              date &&
              mutation.mutate(
                { id: order.id, status: REPORTED_STATUS, date_report: date.toISOString() },
                { onSuccess: () => onOpenChange(false) }
              )
            }
          >
            {mutation.isPending ? "Enregistrement…" : "Reporter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
