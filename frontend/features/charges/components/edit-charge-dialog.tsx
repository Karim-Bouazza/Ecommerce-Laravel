"use client"

import * as React from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChargeFormFields } from "@/features/charges/components/charge-form-fields"
import { CHARGE_CATEGORIES } from "@/features/charges/constants/charge-categories"
import { buildChargeDefaultValues, useUpdateCharge } from "@/features/charges/hooks/use-update-charge"
import type { Charge } from "@/features/charges/types"
import { useProductOptions } from "@/features/products/hooks/use-product-options"

type EditChargeDialogProps = {
  charge: Charge
}

export function EditChargeDialog({ charge }: EditChargeDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateCharge(charge, () => setOpen(false))
  const { reset } = form
  const { data: products = [] } = useProductOptions()

  const categoryLabel = CHARGE_CATEGORIES.find((category) => category.key === charge.category)?.label

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) reset(buildChargeDefaultValues(charge))
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier la charge</DialogTitle>
            {categoryLabel && <DialogDescription>{categoryLabel}</DialogDescription>}
          </DialogHeader>

          <ChargeFormFields form={form} products={products} idPrefix="edit-charge" />

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
