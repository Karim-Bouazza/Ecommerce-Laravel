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
import { useUpdateSupplier } from "@/features/suppliers/hooks/use-update-supplier"
import { SupplierFormFields } from "@/features/suppliers/components/supplier-form-fields"
import type { Supplier } from "@/features/suppliers/types"

type EditSupplierDialogProps = {
  supplier: Supplier
}

export function EditSupplierDialog({ supplier }: EditSupplierDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateSupplier(supplier, () => setOpen(false))
  const { reset } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          reset({
            name: supplier.name,
            phone: supplier.phone ?? "",
            remark: supplier.remark ?? "",
            address: supplier.address ?? "",
          })
        }
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier le Fournisseur</DialogTitle>
          </DialogHeader>

          <SupplierFormFields form={form} idPrefix="edit-supplier" />

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
