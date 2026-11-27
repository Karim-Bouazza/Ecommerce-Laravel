"use client"

import * as React from "react"
import { Pencil } from "lucide-react"
import { toast } from "sonner"

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
import { getWarehouse } from "@/features/warehouses/api/warehouse-api"
import { getErrorMessage } from "@/lib/api"
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
          void getWarehouse(warehouse.id)
            .then((detail) =>
              reset({
                name: detail.name,
                phone: detail.phone ?? "",
                remark: detail.remark ?? "",
                address: detail.address ?? "",
                all_wilayas: detail.all_wilayas,
                all_products: detail.all_products,
                wilaya_ids: detail.wilaya_ids ?? [],
                product_ids: detail.product_ids ?? [],
              })
            )
            .catch((error) => toast.error(getErrorMessage(error)))
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
