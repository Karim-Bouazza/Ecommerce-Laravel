"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelectCombobox, type MultiSelectOption } from "@/components/multi-select/multi-select-combobox"
import type { WarehouseSchema } from "@/features/warehouses/schemas/warehouse-schema"

type WarehouseFormFieldsProps = {
  form: UseFormReturn<WarehouseSchema>
  wilayas: MultiSelectOption[]
  products: MultiSelectOption[]
  idPrefix: string
}

export function WarehouseFormFields({ form, wilayas, products, idPrefix }: WarehouseFormFieldsProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form

  const allWilayas = watch("all_wilayas")
  const allProducts = watch("all_products")

  return (
    <div className="grid gap-4 py-4 sm:grid-cols-2 sm:gap-x-8">
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor={`${idPrefix}-name`}>Nom</FieldLabel>
          <Input id={`${idPrefix}-name`} aria-invalid={!!errors.name} {...register("name")} />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor={`${idPrefix}-phone`}>Numéro de téléphone</FieldLabel>
          <Input id={`${idPrefix}-phone`} aria-invalid={!!errors.phone} {...register("phone")} />
          <FieldError errors={errors.phone ? [errors.phone] : undefined} />
        </Field>

        <Field data-invalid={!!errors.remark}>
          <FieldLabel htmlFor={`${idPrefix}-remark`}>Remarque</FieldLabel>
          <Input id={`${idPrefix}-remark`} aria-invalid={!!errors.remark} {...register("remark")} />
          <FieldError errors={errors.remark ? [errors.remark] : undefined} />
        </Field>

        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor={`${idPrefix}-address`}>Adresse</FieldLabel>
          <Textarea
            id={`${idPrefix}-address`}
            rows={3}
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          <FieldError errors={errors.address ? [errors.address] : undefined} />
        </Field>
      </FieldGroup>

      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-all-wilayas`}>Toutes les wilayas</FieldLabel>
          <Controller
            control={control}
            name="all_wilayas"
            render={({ field }) => (
              <div>
                <Switch
                  id={`${idPrefix}-all-wilayas`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </Field>

        {!allWilayas && (
          <Field data-invalid={!!errors.wilaya_ids}>
            <FieldLabel>Wilaya</FieldLabel>
            <Controller
              control={control}
              name="wilaya_ids"
              render={({ field }) => (
                <MultiSelectCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={wilayas}
                  placeholder="Wilaya"
                  invalid={!!errors.wilaya_ids}
                />
              )}
            />
            <FieldError errors={errors.wilaya_ids ? [errors.wilaya_ids] : undefined} />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-all-products`}>Tous les produits</FieldLabel>
          <Controller
            control={control}
            name="all_products"
            render={({ field }) => (
              <div>
                <Switch
                  id={`${idPrefix}-all-products`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </Field>

        {!allProducts && (
          <Field data-invalid={!!errors.product_ids}>
            <FieldLabel>Produit</FieldLabel>
            <Controller
              control={control}
              name="product_ids"
              render={({ field }) => (
                <MultiSelectCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={products}
                  placeholder="Produit"
                  invalid={!!errors.product_ids}
                />
              )}
            />
            <FieldError errors={errors.product_ids ? [errors.product_ids] : undefined} />
          </Field>
        )}
      </FieldGroup>
    </div>
  )
}
