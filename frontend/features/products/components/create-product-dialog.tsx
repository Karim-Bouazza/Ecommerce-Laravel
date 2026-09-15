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
import { useCreateProduct } from "@/features/products/hooks/use-create-product"
import { ProductFormFields } from "@/features/products/components/product-form-fields"

export function CreateProductDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateProduct(() => setOpen(false))

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
        Nouveau produit
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Nouveau produit</DialogTitle>
          </DialogHeader>

          <ProductFormFields form={form} idPrefix="create-product" />

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
