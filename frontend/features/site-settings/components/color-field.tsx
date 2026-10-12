"use client"

import { Controller, type Control, type FieldError, type FieldPath, type FieldValues } from "react-hook-form"

import { Field, FieldError as FieldErrorMessage, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

type ColorFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  error?: FieldError
}

export function ColorField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  error,
}: ColorFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === "string" ? field.value : ""

        return (
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`${label} — sélecteur`}
                value={HEX_PATTERN.test(value) ? value : "#000000"}
                onChange={(event) => field.onChange(event.target.value)}
                className="size-10 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <Input
                id={name}
                value={value}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                placeholder="#007FFF"
                aria-invalid={!!error}
                maxLength={7}
                className="max-w-40 font-mono uppercase"
              />
            </div>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            <FieldErrorMessage errors={error ? [error] : undefined} />
          </Field>
        )
      }}
    />
  )
}
