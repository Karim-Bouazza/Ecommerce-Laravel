"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { BrandSchema } from "@/features/brands/schemas/brand-schema"

type BrandFormFieldsProps = {
  form: UseFormReturn<BrandSchema>
  idPrefix: string
}

export function BrandFormFields({ form, idPrefix }: BrandFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <FieldGroup className="gap-4 py-4">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Nom</FieldLabel>
        <Input id={`${idPrefix}-name`} aria-invalid={!!errors.name} {...register("name")} />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
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
  )
}
