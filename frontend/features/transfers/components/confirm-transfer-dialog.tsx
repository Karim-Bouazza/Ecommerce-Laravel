"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useConfirmTransfer } from "@/features/transfers/hooks/use-confirm-transfer"
import type { Transfer } from "@/features/transfers/types"

type ConfirmTransferDialogProps = {
  transfer: Transfer
}

export function ConfirmTransferDialog({ transfer }: ConfirmTransferDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useConfirmTransfer(transfer.id, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Confirmer"
            className="text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
          />
        }
      >
        <CheckCircle2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer le transfert</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CheckCircle2 className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">
              Ceci terminera le transfert et mettra à jour le stock.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Non
          </Button>
          <Button type="button" disabled={isPending} onClick={() => mutate()}>
            {isPending ? "Confirmation…" : "Oui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
