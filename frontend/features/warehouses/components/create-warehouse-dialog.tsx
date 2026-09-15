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
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { useCreateWarehouse } from "@/features/warehouses/hooks/use-create-warehouse"
import { WarehouseFormFields } from "@/features/warehouses/components/warehouse-form-fields"
import { useWilayas } from "@/features/wilayas/hooks/use-wilayas"

export function CreateWarehouseDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateWarehouse(() => setOpen(false))

  const { data: wilayas = [] } = useWilayas()
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
        Nouvel Entrepôt
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Nouvel entrepôt</DialogTitle>
          </DialogHeader>

          <WarehouseFormFields form={form} wilayas={wilayas} products={products} idPrefix="create-warehouse" />

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
