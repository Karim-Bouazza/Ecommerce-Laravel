"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreatePaiement } from "@/features/paiements/hooks/use-create-paiement"
import { PaiementFormFields } from "@/features/paiements/components/paiement-form-fields"

export function CreatePaiementDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreatePaiement(() => setOpen(false))

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset()
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Nouveau paiement
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Nouveau paiement</DialogTitle>
          </DialogHeader>

          <PaiementFormFields form={form} idPrefix="create-paiement" />

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
