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
import { usePurchaseEntryOptions } from "@/features/return-entries/hooks/use-purchase-entry-options"
import { usePurchaseEntryReturnableItems } from "@/features/return-entries/hooks/use-purchase-entry-returnable-items"
import { useCreateReturnEntry } from "@/features/return-entries/hooks/use-create-return-entry"
import { ReturnEntryFormFields } from "@/features/return-entries/components/return-entry-form-fields"

export function CreateReturnEntryDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateReturnEntry(() => setOpen(false))

  const { data: purchaseEntryOptions = [] } = usePurchaseEntryOptions()
  const purchaseEntryId = form.watch("purchase_entry_id") || null
  const { data: returnableItems = [], isFetching: isLoadingReturnableItems } =
    usePurchaseEntryReturnableItems(purchaseEntryId)

  const selectedOption = purchaseEntryOptions.find((option) => option.id === purchaseEntryId)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset({ purchase_entry_id: 0, remark: "", items: [] })
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Nouvelle Entrée de retour
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Nouvelle Entrée de retour</DialogTitle>
          </DialogHeader>

          <ReturnEntryFormFields
            form={form}
            purchaseEntryOptions={purchaseEntryOptions}
            returnableItems={returnableItems}
            isLoadingReturnableItems={isLoadingReturnableItems}
            sourceLocked={false}
            sourceWarehouseName={selectedOption?.warehouse_name ?? null}
            sourceFournisseurName={selectedOption?.fournisseur_name ?? null}
            idPrefix="create-return-entry"
          />

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
