"use client"

import type { UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { TagSchema } from "@/features/tags/schemas/tag-schema"

type TagFormFieldsProps = {
  form: UseFormReturn<TagSchema>
  idPrefix: string
}

export function TagFormFields({ form, idPrefix }: TagFormFieldsProps) {
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
    </FieldGroup>
  )
}
