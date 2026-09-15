"use client"

import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EntitySelect, type EntityOption } from "@/features/purchase-entries/components/entity-select"
import type { PurchaseEntrySchema } from "@/features/purchase-entries/schemas/purchase-entry-schema"

const totalFormatter = new Intl.NumberFormat("fr-FR")

type PurchaseEntryFormFieldsProps = {
  form: UseFormReturn<PurchaseEntrySchema>
  warehouses: EntityOption[]
  fournisseurs: EntityOption[]
  products: EntityOption[]
  idPrefix: string
}

export function PurchaseEntryFormFields({
  form,
  warehouses,
  fournisseurs,
  products,
  idPrefix,
}: PurchaseEntryFormFieldsProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const items = watch("items")

  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.purchase_price) || 0),
    0
  )

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={!!errors.warehouse_id}>
          <FieldLabel>Entrepôt</FieldLabel>
          <Controller
            control={control}
            name="warehouse_id"
            render={({ field }) => (
              <EntitySelect
                value={field.value || null}
                onChange={field.onChange}
                options={warehouses}
                invalid={!!errors.warehouse_id}
              />
            )}
          />
          <FieldError errors={errors.warehouse_id ? [errors.warehouse_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.fournisseur_id}>
          <FieldLabel>Fournisseur de produits</FieldLabel>
          <Controller
            control={control}
            name="fournisseur_id"
            render={({ field }) => (
              <EntitySelect
                value={field.value || null}
                onChange={field.onChange}
                options={fournisseurs}
                invalid={!!errors.fournisseur_id}
              />
            )}
          />
          <FieldError errors={errors.fournisseur_id ? [errors.fournisseur_id] : undefined} />
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
            onClick={() => append({ product_id: 0, quantity: 1, purchase_price: 0 })}
          >
            <Plus className="size-4" />
            Ajouter des produits
          </Button>
        </div>

        <FieldGroup className="gap-3">
          {fields.map((fieldItem, index) => (
            <div
              key={fieldItem.id}
              className="grid grid-cols-2 items-start gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]"
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
                      options={products}
                      placeholder="Sélectionner un produit"
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
                <FieldLabel className="text-xs text-muted-foreground">Quantité</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  aria-invalid={!!errors.items?.[index]?.quantity}
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
                <FieldError
                  errors={
                    errors.items?.[index]?.quantity ? [errors.items[index]!.quantity!] : undefined
                  }
                />
              </Field>

              <Field data-invalid={!!errors.items?.[index]?.purchase_price}>
                <FieldLabel className="text-xs text-muted-foreground">Prix d&rsquo;achat</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  aria-invalid={!!errors.items?.[index]?.purchase_price}
                  {...register(`items.${index}.purchase_price`, { valueAsNumber: true })}
                />
                <FieldError
                  errors={
                    errors.items?.[index]?.purchase_price
                      ? [errors.items[index]!.purchase_price!]
                      : undefined
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
          ))}
        </FieldGroup>
      </div>

      <Field>
        <FieldLabel>Total</FieldLabel>
        <Input value={`${totalFormatter.format(total)} DZD`} readOnly disabled />
      </Field>
    </div>
  )
}
