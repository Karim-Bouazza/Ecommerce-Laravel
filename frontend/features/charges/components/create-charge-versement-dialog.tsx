"use client"

import * as React from "react"
import { Landmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateChargeVersement } from "@/features/charges/hooks/use-create-charge-versement"
import { ChargeVersementFormFields } from "@/features/charges/components/charge-versement-form-fields"
import type { Charge } from "@/features/charges/types"

type CreateChargeVersementDialogProps = {
  charge: Charge
}

export function CreateChargeVersementDialog({ charge }: CreateChargeVersementDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateChargeVersement(charge.id, () => setOpen(false))

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset()
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Créer un versement"
            className="text-violet-600 hover:text-violet-600 dark:text-violet-400"
          />
        }
      >
        <Landmark className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Créer un versement</DialogTitle>
          </DialogHeader>

          <ChargeVersementFormFields charge={charge} form={form} idPrefix="create-charge-versement" />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
