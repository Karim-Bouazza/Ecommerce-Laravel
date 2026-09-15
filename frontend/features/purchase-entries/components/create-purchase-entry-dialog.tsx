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
import { useSupplierOptions } from "@/features/suppliers/hooks/use-supplier-options"
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { useWarehouseOptions } from "@/features/warehouses/hooks/use-warehouse-options"
import { useCreatePurchaseEntry } from "@/features/purchase-entries/hooks/use-create-purchase-entry"
import { PurchaseEntryFormFields } from "@/features/purchase-entries/components/purchase-entry-form-fields"

export function CreatePurchaseEntryDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreatePurchaseEntry(() => setOpen(false))

  const { data: warehouses = [] } = useWarehouseOptions()
  const { data: fournisseurs = [] } = useSupplierOptions()
  const { data: products = [] } = useProductOptions()

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
        Nouvelle Entrée d&rsquo;achat
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Nouvelle Entrée d&rsquo;achat</DialogTitle>
          </DialogHeader>

          <PurchaseEntryFormFields
            form={form}
            warehouses={warehouses}
            fournisseurs={fournisseurs}
            products={products}
            idPrefix="create-purchase-entry"
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
