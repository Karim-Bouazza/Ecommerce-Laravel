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
import { useCreatePurchaseEntryVersement } from "@/features/purchase-entries/hooks/use-create-purchase-entry-versement"
import { PurchaseEntryVersementFormFields } from "@/features/purchase-entries/components/purchase-entry-versement-form-fields"
import type { PurchaseEntry } from "@/features/purchase-entries/types"

type CreatePurchaseEntryVersementDialogProps = {
  entry: PurchaseEntry
}

export function CreatePurchaseEntryVersementDialog({ entry }: CreatePurchaseEntryVersementDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreatePurchaseEntryVersement(entry.id, () => setOpen(false))

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

          <PurchaseEntryVersementFormFields entry={entry} form={form} idPrefix="create-purchase-entry-versement" />

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
