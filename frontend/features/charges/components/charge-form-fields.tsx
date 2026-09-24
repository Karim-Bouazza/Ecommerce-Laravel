"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { DatePicker } from "@/components/date-picker/date-picker"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MultiSelectCombobox, type MultiSelectOption } from "@/components/multi-select/multi-select-combobox"
import { CHARGE_TYPES } from "@/features/charges/constants/charge-types"
import { CHARGE_ORDER_TRIGGERS } from "@/features/charges/constants/charge-order-triggers"
import { CHARGE_RECURRENCE_FREQUENCIES } from "@/features/charges/constants/charge-recurrence-frequencies"
import type { ChargeSchema } from "@/features/charges/schemas/charge-schema"

type ChargeFormFieldsProps = {
  form: UseFormReturn<ChargeSchema>
  products: MultiSelectOption[]
  idPrefix: string
}

export function ChargeFormFields({ form, products, idPrefix }: ChargeFormFieldsProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form

  const type = watch("type")
  const allProducts = watch("all_products")
  const isPerOrder = type === "per_order"
  const isRecurring = type === "recurring"

  return (
    <FieldGroup className="gap-4 py-4">
      <Field>
        <FieldLabel>Type</FieldLabel>
        <div className="flex gap-2">
          {CHARGE_TYPES.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={type === option.value ? "default" : "outline"}
              className="flex-1"
              onClick={() => setValue("type", option.value, { shouldValidate: true })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Field>

      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Nom</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          placeholder="e.g. Meta charges"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
      </Field>

      <div className={isPerOrder || isRecurring ? "grid grid-cols-2 gap-4" : undefined}>
        <Field data-invalid={!!errors.amount}>
          <FieldLabel htmlFor={`${idPrefix}-amount`}>
            {isPerOrder ? "Valeur par commande (DZD)" : "Montant (DZD)"}
          </FieldLabel>
          <Input
            id={`${idPrefix}-amount`}
            inputMode="decimal"
            placeholder="e.g. 30000"
            aria-invalid={!!errors.amount}
            {...register("amount")}
          />
          <FieldError errors={errors.amount ? [errors.amount] : undefined} />
        </Field>

        {isPerOrder && (
          <Field data-invalid={!!errors.order_trigger}>
            <FieldLabel>Type Récurrent</FieldLabel>
            <Controller
              control={control}
              name="order_trigger"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-invalid={!!errors.order_trigger}>
                    <SelectValue placeholder="Sélectionnez le type de récurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHARGE_ORDER_TRIGGERS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={errors.order_trigger ? [errors.order_trigger] : undefined} />
          </Field>
        )}

        {isRecurring && (
          <Field data-invalid={!!errors.recurrence_frequency}>
            <FieldLabel>Type Récurrent</FieldLabel>
            <Controller
              control={control}
              name="recurrence_frequency"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-invalid={!!errors.recurrence_frequency}>
                    <SelectValue placeholder="Sélectionnez le type de récurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHARGE_RECURRENCE_FREQUENCIES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError
              errors={errors.recurrence_frequency ? [errors.recurrence_frequency] : undefined}
            />
          </Field>
        )}
      </div>

      {!isRecurring && (
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.starts_at}>
            <FieldLabel>De</FieldLabel>
            <Controller
              control={control}
              name="starts_at"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? undefined}
                  onChange={(date) => field.onChange(date ?? null)}
                  invalid={!!errors.starts_at}
                />
              )}
            />
            <FieldError errors={errors.starts_at ? [errors.starts_at] : undefined} />
          </Field>

          <Field data-invalid={!!errors.ends_at}>
            <FieldLabel>À</FieldLabel>
            <Controller
              control={control}
              name="ends_at"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? undefined}
                  onChange={(date) => field.onChange(date ?? null)}
                  invalid={!!errors.ends_at}
                />
              )}
            />
            <FieldError errors={errors.ends_at ? [errors.ends_at] : undefined} />
          </Field>
        </div>
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
          <FieldLabel>Produits</FieldLabel>
          <Controller
            control={control}
            name="product_ids"
            render={({ field }) => (
              <MultiSelectCombobox
                value={field.value}
                onChange={field.onChange}
                options={products}
                placeholder="Produits"
                invalid={!!errors.product_ids}
              />
            )}
          />
          <FieldError errors={errors.product_ids ? [errors.product_ids] : undefined} />
        </Field>
      )}
    </FieldGroup>
  )
}
