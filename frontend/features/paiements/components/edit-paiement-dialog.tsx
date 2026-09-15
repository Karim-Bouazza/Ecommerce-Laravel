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
import {
  useUpdatePaiement,
  paiementToFormValues,
} from "@/features/paiements/hooks/use-update-paiement"
import { PaiementFormFields } from "@/features/paiements/components/paiement-form-fields"
import type { Paiement } from "@/features/paiements/types"

type EditPaiementDialogProps = {
  paiement: Paiement
}

export function EditPaiementDialog({ paiement }: EditPaiementDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdatePaiement(paiement, () => setOpen(false))
  const { reset } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) reset(paiementToFormValues(paiement))
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier le paiement</DialogTitle>
          </DialogHeader>

          <PaiementFormFields form={form} idPrefix="edit-paiement" />

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
