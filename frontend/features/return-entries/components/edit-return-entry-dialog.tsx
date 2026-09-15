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
import { usePurchaseEntryOptions } from "@/features/return-entries/hooks/use-purchase-entry-options"
import { usePurchaseEntryReturnableItems } from "@/features/return-entries/hooks/use-purchase-entry-returnable-items"
import {
  returnEntryToFormValues,
  useUpdateReturnEntry,
} from "@/features/return-entries/hooks/use-update-return-entry"
import { ReturnEntryFormFields } from "@/features/return-entries/components/return-entry-form-fields"
import type { ReturnEntry } from "@/features/return-entries/types"

type EditReturnEntryDialogProps = {
  entry: ReturnEntry
}

export function EditReturnEntryDialog({ entry }: EditReturnEntryDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateReturnEntry(entry, () => setOpen(false))
  const { reset } = form

  const { data: purchaseEntryOptions = [] } = usePurchaseEntryOptions()
  const { data: returnableItems = [], isFetching: isLoadingReturnableItems } = usePurchaseEntryReturnableItems(
    entry.purchase_entry.id,
    entry.id
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) reset(returnEntryToFormValues(entry))
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier l&rsquo;entrée de retour</DialogTitle>
          </DialogHeader>

          <ReturnEntryFormFields
            form={form}
            purchaseEntryOptions={purchaseEntryOptions}
            returnableItems={returnableItems}
            isLoadingReturnableItems={isLoadingReturnableItems}
            sourceLocked
            sourceWarehouseName={entry.warehouse.name}
            sourceFournisseurName={entry.fournisseur.name}
            idPrefix="edit-return-entry"
          />

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
