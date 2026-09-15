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
import { useUpdateProduct } from "@/features/products/hooks/use-update-product"
import { ProductFormFields } from "@/features/products/components/product-form-fields"
import type { Product } from "@/features/products/types"

type EditProductDialogProps = {
  product: Product
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateProduct(product, () => setOpen(false))
  const { reset } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          reset({
            name: product.name,
            description: product.description,
            category_id: product.category_id,
            purchase_price: product.purchase_price,
            price: product.price,
            is_active: product.is_active,
            image: null,
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
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>

          <ProductFormFields form={form} idPrefix="edit-product" currentImageUrl={product.image} />

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
