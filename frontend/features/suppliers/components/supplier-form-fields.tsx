"use client"

import type { UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SupplierSchema } from "@/features/suppliers/schemas/supplier-schema"

type SupplierFormFieldsProps = {
  form: UseFormReturn<SupplierSchema>
  idPrefix: string
}

export function SupplierFormFields({ form, idPrefix }: SupplierFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup className="gap-4 py-4">
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
  )
}
