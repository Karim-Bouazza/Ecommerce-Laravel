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
  useUpdateVersement,
  versementToFormValues,
} from "@/features/versements/hooks/use-update-versement"
import { VersementFormFields } from "@/features/versements/components/versement-form-fields"
import type { Versement } from "@/features/versements/types"

type EditVersementDialogProps = {
  versement: Versement
}

export function EditVersementDialog({ versement }: EditVersementDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateVersement(versement, () => setOpen(false))
  const { reset } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) reset(versementToFormValues(versement))
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier le versement</DialogTitle>
          </DialogHeader>

          <VersementFormFields form={form} idPrefix="edit-versement" />

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
