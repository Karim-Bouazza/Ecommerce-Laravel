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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAdjustStock } from "@/features/stock/hooks/use-adjust-stock"
import type { StockItem } from "@/features/stock/types"

type UpdateStockDialogProps = {
  product: StockItem
  warehouseId: number
}

export function UpdateStockDialog({ product, warehouseId }: UpdateStockDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useAdjustStock(product, warehouseId, () => setOpen(false))
  const { register, reset, formState: { errors } } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          reset({ adjustment: 0, purchase_price: product.purchase_price ?? 0 })
        }
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Mettre à jour les stocks de produits</DialogTitle>
          </DialogHeader>

          <p className="pb-2 text-sm font-medium">{product.name}</p>

          <FieldGroup className="grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="update-stock-current">Stock Actuel</FieldLabel>
              <Input id="update-stock-current" value={product.stock_interne} disabled />
            </Field>

            <Field data-invalid={!!errors.adjustment}>
              <FieldLabel htmlFor="update-stock-adjustment">Nouvelle Quantité</FieldLabel>
              <Input
                id="update-stock-adjustment"
                type="number"
                aria-invalid={!!errors.adjustment}
                {...register("adjustment", { valueAsNumber: true })}
              />
              <FieldError errors={errors.adjustment ? [errors.adjustment] : undefined} />
            </Field>

            <Field data-invalid={!!errors.purchase_price}>
              <FieldLabel htmlFor="update-stock-purchase-price">Prix d&apos;achat</FieldLabel>
              <Input
                id="update-stock-purchase-price"
                type="number"
                step="0.01"
                aria-invalid={!!errors.purchase_price}
                {...register("purchase_price", { valueAsNumber: true })}
              />
              <FieldError errors={errors.purchase_price ? [errors.purchase_price] : undefined} />
            </Field>
          </FieldGroup>

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
