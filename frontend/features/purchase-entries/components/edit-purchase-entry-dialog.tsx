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
import { useSupplierOptions } from "@/features/suppliers/hooks/use-supplier-options"
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { useWarehouseOptions } from "@/features/warehouses/hooks/use-warehouse-options"
import {
  purchaseEntryToFormValues,
  useUpdatePurchaseEntry,
} from "@/features/purchase-entries/hooks/use-update-purchase-entry"
import { PurchaseEntryFormFields } from "@/features/purchase-entries/components/purchase-entry-form-fields"
import type { PurchaseEntry } from "@/features/purchase-entries/types"

type EditPurchaseEntryDialogProps = {
  entry: PurchaseEntry
}

export function EditPurchaseEntryDialog({ entry }: EditPurchaseEntryDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdatePurchaseEntry(entry, () => setOpen(false))
  const { reset } = form

  const { data: warehouses = [] } = useWarehouseOptions()
  const { data: fournisseurs = [] } = useSupplierOptions()
  const { data: products = [] } = useProductOptions()

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          reset(purchaseEntryToFormValues(entry))
        }
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier l&rsquo;entrée d&rsquo;achat</DialogTitle>
          </DialogHeader>

          <PurchaseEntryFormFields
            form={form}
            warehouses={warehouses}
            fournisseurs={fournisseurs}
            products={products}
            idPrefix="edit-purchase-entry"
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
