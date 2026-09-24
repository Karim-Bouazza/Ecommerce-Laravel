"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChargeFormFields } from "@/features/charges/components/charge-form-fields"
import type { ChargeCategoryDefinition } from "@/features/charges/constants/charge-categories"
import { useCreateCharge } from "@/features/charges/hooks/use-create-charge"
import { useProductOptions } from "@/features/products/hooks/use-product-options"

type CreateChargeDialogProps = {
  category: ChargeCategoryDefinition
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChargeDialog({ category, open, onOpenChange }: CreateChargeDialogProps) {
  const { form, onSubmit, isSubmitting } = useCreateCharge(category.key, () => onOpenChange(false))
  const { data: products = [] } = useProductOptions()

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) form.reset()
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Nouvelle charge</DialogTitle>
            <DialogDescription>{category.label}</DialogDescription>
          </DialogHeader>

          <ChargeFormFields form={form} products={products} idPrefix="create-charge" />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
