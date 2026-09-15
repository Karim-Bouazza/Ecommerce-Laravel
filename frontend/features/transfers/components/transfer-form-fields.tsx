"use client"

import * as React from "react"
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EntitySelect, type EntityOption } from "@/features/transfers/components/entity-select"
import { useWarehouseProductOptions } from "@/features/transfers/hooks/use-warehouse-product-options"
import type { TransferSchema } from "@/features/transfers/schemas/transfer-schema"

type TransferFormFieldsProps = {
  form: UseFormReturn<TransferSchema>
  warehouses: EntityOption[]
  idPrefix: string
}

export function TransferFormFields({ form, warehouses, idPrefix }: TransferFormFieldsProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form

  const { fields, append, remove, replace } = useFieldArray({ control, name: "items" })
  const fromWarehouseId = watch("from_warehouse_id")
  const items = watch("items")

  const { data: productOptions = [] } = useWarehouseProductOptions(fromWarehouseId || null)
  const quantityById = React.useMemo(
    () => new Map(productOptions.map((option) => [option.id, option.quantity])),
    [productOptions]
  )

  const previousFromWarehouseId = React.useRef(fromWarehouseId)
  React.useEffect(() => {
    if (previousFromWarehouseId.current !== fromWarehouseId) {
      previousFromWarehouseId.current = fromWarehouseId
      replace([{ product_id: 0, quantity: 1 }])
    }
  }, [fromWarehouseId, replace])

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={!!errors.from_warehouse_id}>
          <FieldLabel>De</FieldLabel>
          <Controller
            control={control}
            name="from_warehouse_id"
            render={({ field }) => (
              <EntitySelect
                value={field.value || null}
                onChange={field.onChange}
                options={warehouses}
                placeholder="Sélectionner l'entrepôt source"
                invalid={!!errors.from_warehouse_id}
              />
            )}
          />
          <FieldError errors={errors.from_warehouse_id ? [errors.from_warehouse_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.to_warehouse_id}>
          <FieldLabel>À</FieldLabel>
          <Controller
            control={control}
            name="to_warehouse_id"
            render={({ field }) => (
              <EntitySelect
                value={field.value || null}
                onChange={field.onChange}
                options={warehouses}
                placeholder="Sélectionner l'entrepôt de destination"
                invalid={!!errors.to_warehouse_id}
              />
            )}
          />
          <FieldError errors={errors.to_warehouse_id ? [errors.to_warehouse_id] : undefined} />
        </Field>
      </div>

      <Field data-invalid={!!errors.remark}>
        <FieldLabel htmlFor={`${idPrefix}-remark`}>Remarque</FieldLabel>
        <Textarea
          id={`${idPrefix}-remark`}
          rows={3}
          aria-invalid={!!errors.remark}
          {...register("remark")}
        />
        <FieldError errors={errors.remark ? [errors.remark] : undefined} />
      </Field>

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Produits</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!fromWarehouseId}
            onClick={() => append({ product_id: 0, quantity: 1 })}
          >
            <Plus className="size-4" />
            Ajouter des produits
          </Button>
        </div>

        {!fromWarehouseId && (
          <p className="text-sm text-muted-foreground">
            Sélectionnez d&rsquo;abord l&rsquo;entrepôt source.
          </p>
        )}

        <FieldGroup className="gap-3">
          {fields.map((fieldItem, index) => {
            const selectedProductId = items?.[index]?.product_id
            const max = selectedProductId ? quantityById.get(selectedProductId) : undefined

            return (
              <div
                key={fieldItem.id}
                className="grid grid-cols-2 items-start gap-2 sm:grid-cols-[2fr_1fr_auto]"
              >
                <Field
                  className="col-span-2 sm:col-span-1"
                  data-invalid={!!errors.items?.[index]?.product_id}
                >
                  <FieldLabel className="text-xs text-muted-foreground">Nom du produit</FieldLabel>
                  <Controller
                    control={control}
                    name={`items.${index}.product_id`}
                    render={({ field }) => (
                      <EntitySelect
                        value={field.value || null}
                        onChange={field.onChange}
                        options={productOptions}
                        placeholder="Sélectionner un produit"
                        disabled={!fromWarehouseId}
                        invalid={!!errors.items?.[index]?.product_id}
                      />
                    )}
                  />
                  <FieldError
                    errors={
                      errors.items?.[index]?.product_id ? [errors.items[index]!.product_id!] : undefined
                    }
                  />
                </Field>

                <Field data-invalid={!!errors.items?.[index]?.quantity}>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Quantité{max !== undefined ? ` (MAX ${max})` : ""}
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={max}
                    aria-invalid={!!errors.items?.[index]?.quantity}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  />
                  <FieldError
                    errors={
                      errors.items?.[index]?.quantity ? [errors.items[index]!.quantity!] : undefined
                    }
                  />
                </Field>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-5 text-destructive hover:text-destructive"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )
          })}
        </FieldGroup>
      </div>
    </div>
  )
}
