"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CategorySelect } from "@/features/categories/components/category-select"
import type { ProductFormInput } from "@/features/products/schemas/product-schema"

type ProductFormFieldsProps<TOutput> = {
  form: UseFormReturn<ProductFormInput, unknown, TOutput>
  idPrefix: string
  currentImageUrl?: string | null
}

export function ProductFormFields<TOutput>({
  form,
  idPrefix,
  currentImageUrl,
}: ProductFormFieldsProps<TOutput>) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className="grid gap-4 py-4 sm:grid-cols-2 sm:gap-x-8">
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor={`${idPrefix}-name`}>Nom</FieldLabel>
          <Input id={`${idPrefix}-name`} aria-invalid={!!errors.name} {...register("name")} />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor={`${idPrefix}-description`}>Description</FieldLabel>
          <Textarea
            id={`${idPrefix}-description`}
            rows={4}
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          <FieldError errors={errors.description ? [errors.description] : undefined} />
        </Field>

        <Field data-invalid={!!errors.category_id}>
          <FieldLabel htmlFor={`${idPrefix}-category`}>Catégorie</FieldLabel>
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <CategorySelect
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.category_id}
              />
            )}
          />
          <FieldError errors={errors.category_id ? [errors.category_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.image}>
          <FieldLabel htmlFor={`${idPrefix}-image`}>Image</FieldLabel>
          {currentImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentImageUrl}
              alt=""
              className="size-16 rounded-md border object-cover"
            />
          )}
          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <Input
                id={`${idPrefix}-image`}
                type="file"
                accept="image/*"
                name={name}
                ref={ref}
                onBlur={onBlur}
                aria-invalid={!!errors.image}
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
              />
            )}
          />
          <FieldError errors={errors.image ? [errors.image] : undefined} />
        </Field>
      </FieldGroup>

      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.purchase_price}>
          <FieldLabel htmlFor={`${idPrefix}-purchase-price`}>Prix d&rsquo;achat (DZD)</FieldLabel>
          <Input
            id={`${idPrefix}-purchase-price`}
            type="number"
            min={0}
            aria-invalid={!!errors.purchase_price}
            {...register("purchase_price", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
          />
          <FieldError errors={errors.purchase_price ? [errors.purchase_price] : undefined} />
        </Field>

        <Field data-invalid={!!errors.price}>
          <FieldLabel htmlFor={`${idPrefix}-price`}>Prix de vente (DZD)</FieldLabel>
          <Input
            id={`${idPrefix}-price`}
            type="number"
            min={0}
            aria-invalid={!!errors.price}
            {...register("price", { valueAsNumber: true })}
          />
          <FieldError errors={errors.price ? [errors.price] : undefined} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-is-active`}>Actif</FieldLabel>
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <div>
                <Switch
                  id={`${idPrefix}-is-active`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
