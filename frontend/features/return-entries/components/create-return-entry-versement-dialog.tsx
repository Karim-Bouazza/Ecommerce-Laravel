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
import { useCreateReturnEntryVersement } from "@/features/return-entries/hooks/use-create-return-entry-versement"
import { ReturnEntryVersementFormFields } from "@/features/return-entries/components/return-entry-versement-form-fields"
import type { ReturnEntry } from "@/features/return-entries/types"

type CreateReturnEntryVersementDialogProps = {
  entry: ReturnEntry
}

export function CreateReturnEntryVersementDialog({ entry }: CreateReturnEntryVersementDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateReturnEntryVersement(
    entry.id,
    entry.remaining_amount,
    () => setOpen(false)
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          form.reset({
            date: new Date(),
            wallet_id: null,
            remark: "",
          })
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Créer un paiement"
            className="text-violet-600 hover:text-violet-600 dark:text-violet-400"
          />
        }
      >
        <Landmark className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Créer un paiement</DialogTitle>
          </DialogHeader>

          <ReturnEntryVersementFormFields entry={entry} form={form} idPrefix="create-return-entry-versement" />

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
