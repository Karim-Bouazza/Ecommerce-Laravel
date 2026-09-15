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
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { useUpdateWarehouse } from "@/features/warehouses/hooks/use-update-warehouse"
import { WarehouseFormFields } from "@/features/warehouses/components/warehouse-form-fields"
import type { Warehouse } from "@/features/warehouses/types"
import { useWilayas } from "@/features/wilayas/hooks/use-wilayas"

type EditWarehouseDialogProps = {
  warehouse: Warehouse
}

export function EditWarehouseDialog({ warehouse }: EditWarehouseDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateWarehouse(warehouse, () => setOpen(false))
  const { reset } = form

  const { data: wilayas = [] } = useWilayas()
  const { data: products = [] } = useProductOptions()

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          reset({
            name: warehouse.name,
            phone: warehouse.phone ?? "",
            remark: warehouse.remark ?? "",
            address: warehouse.address ?? "",
            all_wilayas: warehouse.all_wilayas,
            all_products: warehouse.all_products,
            wilaya_ids: warehouse.wilaya_ids,
            product_ids: warehouse.product_ids,
          })
        }
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;entrepôt</DialogTitle>
          </DialogHeader>

          <WarehouseFormFields form={form} wilayas={wilayas} products={products} idPrefix="edit-warehouse" />

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
