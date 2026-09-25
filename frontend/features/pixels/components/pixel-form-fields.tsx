"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PIXEL_PROVIDERS } from "@/features/pixels/constants/pixel-providers"
import type { PixelSchema } from "@/features/pixels/schemas/pixel-schema"

type PixelFormFieldsProps = {
  form: UseFormReturn<PixelSchema>
  idPrefix: string
}

export function PixelFormFields({ form, idPrefix }: PixelFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <FieldGroup className="gap-4 py-4">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Nom du pixel</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          placeholder="e.g. My Pixel"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
      </Field>

      <Field data-invalid={!!errors.provider}>
        <FieldLabel>Fournisseur</FieldLabel>
        <Controller
          control={control}
          name="provider"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.provider}>
                <SelectValue placeholder="Sélectionnez un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {PIXEL_PROVIDERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={errors.provider ? [errors.provider] : undefined} />
      </Field>

      <Field data-invalid={!!errors.pixel_id}>
        <FieldLabel htmlFor={`${idPrefix}-pixel-id`}>ID du pixel</FieldLabel>
        <Input
          id={`${idPrefix}-pixel-id`}
          placeholder="e.g. 123456789012345"
          aria-invalid={!!errors.pixel_id}
          {...register("pixel_id")}
        />
        <FieldError errors={errors.pixel_id ? [errors.pixel_id] : undefined} />
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
