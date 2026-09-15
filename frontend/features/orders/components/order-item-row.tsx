"use client"

import * as React from "react"
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EntitySelect } from "@/features/orders/components/entity-select"
import { useWarehouseProductOptions } from "@/features/orders/hooks/use-warehouse-product-options"
import type { EntityOption } from "@/features/orders/components/entity-select"
import type { CreateOrderSchema } from "@/features/orders/schemas/order-schema"

type OrderItemRowProps = {
  control: Control<CreateOrderSchema>
  watch: UseFormWatch<CreateOrderSchema>
  setValue: UseFormSetValue<CreateOrderSchema>
  errors: FieldErrors<CreateOrderSchema>
  index: number
  warehouses: EntityOption[]
  canRemove: boolean
  onRemove: () => void
  onProductSelected: (index: number, price: number) => void
}

export function OrderItemRow({
  control,
  watch,
  setValue,
  errors,
  index,
  warehouses,
  canRemove,
  onRemove,
  onProductSelected,
}: OrderItemRowProps) {
  const warehouseId = watch(`items.${index}.warehouse_id`)
  const { data: productOptions = [] } = useWarehouseProductOptions(warehouseId || null)
  const quantityById = React.useMemo(
    () => new Map(productOptions.map((option) => [option.id, option.quantity])),
    [productOptions]
  )
  const priceById = React.useMemo(
    () => new Map(productOptions.map((option) => [option.id, option.price])),
    [productOptions]
  )

  const selectedProductId = watch(`items.${index}.product_id`)
  const max = selectedProductId ? quantityById.get(selectedProductId) : undefined

  const itemErrors = errors.items?.[index]

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">Produit {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field data-invalid={!!itemErrors?.warehouse_id}>
          <FieldLabel className="text-xs text-muted-foreground">Entrepôt</FieldLabel>
          <Controller
            control={control}
            name={`items.${index}.warehouse_id`}
            render={({ field }) => (
              <EntitySelect
                value={field.value || null}
                onChange={(value) => {
                  field.onChange(value)
                  setValue(`items.${index}.product_id`, 0)
                }}
                options={warehouses}
                placeholder="Sélectionner l'entrepôt"
                invalid={!!itemErrors?.warehouse_id}
              />
            )}
          />
          <FieldError errors={itemErrors?.warehouse_id ? [itemErrors.warehouse_id] : undefined} />
        </Field>

        <Field data-invalid={!!itemErrors?.product_id}>
          <FieldLabel className="text-xs text-muted-foreground">Nom du produit</FieldLabel>
          <Controller
            control={control}
            name={`items.${index}.product_id`}
            render={({ field }) => (
              <EntitySelect
                value={field.value || null}
                onChange={(value) => {
                  field.onChange(value)
                  const price = priceById.get(value)
                  if (price !== undefined) onProductSelected(index, price)
                }}
                options={productOptions}
                placeholder="Sélectionner un produit"
                disabled={!warehouseId}
                invalid={!!itemErrors?.product_id}
              />
            )}
          />
          <FieldError errors={itemErrors?.product_id ? [itemErrors.product_id] : undefined} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field data-invalid={!!itemErrors?.variant}>
          <FieldLabel className="text-xs text-muted-foreground">Variante</FieldLabel>
          <Controller
            control={control}
            name={`items.${index}.variant`}
            render={({ field }) => (
              <Input
                placeholder="Ex: Rouge / 42"
                value={field.value ?? ""}
                onChange={field.onChange}
                aria-invalid={!!itemErrors?.variant}
              />
            )}
          />
          <FieldError errors={itemErrors?.variant ? [itemErrors.variant] : undefined} />
        </Field>

        <Field data-invalid={!!itemErrors?.quantity}>
          <FieldLabel className="text-xs text-muted-foreground">
            Quantité{max !== undefined ? ` (Disponible ${max})` : ""}
          </FieldLabel>
          <Controller
            control={control}
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <Input
                type="number"
                min={1}
                max={max}
                value={field.value ?? 1}
                onChange={(event) => field.onChange(Number(event.target.value))}
                aria-invalid={!!itemErrors?.quantity}
              />
            )}
          />
          <FieldError errors={itemErrors?.quantity ? [itemErrors.quantity] : undefined} />
        </Field>

        <Field data-invalid={!!itemErrors?.unit_price}>
          <FieldLabel className="text-xs text-muted-foreground">Prix</FieldLabel>
          <Controller
            control={control}
            name={`items.${index}.unit_price`}
            render={({ field }) => (
              <Input
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(event) =>
                  field.onChange(event.target.value === "" ? undefined : Number(event.target.value))
                }
                aria-invalid={!!itemErrors?.unit_price}
              />
            )}
          />
          <FieldError errors={itemErrors?.unit_price ? [itemErrors.unit_price] : undefined} />
        </Field>
      </div>
    </div>
  )
}
