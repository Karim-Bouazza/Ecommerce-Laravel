"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { DatePicker } from "@/components/date-picker/date-picker"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { WalletSelect } from "@/features/wallets/components/wallet-select"
import { DeliveryPartnerSelect } from "@/features/paiements/components/delivery-partner-select"
import type { PaiementSchema } from "@/features/paiements/schemas/paiement-schema"

type PaiementFormFieldsProps = {
  form: UseFormReturn<PaiementSchema>
  idPrefix: string
}

export function PaiementFormFields({ form, idPrefix }: PaiementFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <FieldGroup className="gap-4 py-4">
      <Field data-invalid={!!errors.date}>
        <FieldLabel>Date</FieldLabel>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(date) => field.onChange(date ?? field.value)}
              invalid={!!errors.date}
            />
          )}
        />
        <FieldError errors={errors.date ? [errors.date] : undefined} />
      </Field>

      <Field data-invalid={!!errors.wallet_id}>
        <FieldLabel>Portefeuille</FieldLabel>
        <Controller
          control={control}
          name="wallet_id"
          render={({ field }) => (
            <WalletSelect
              value={field.value}
              onChange={field.onChange}
              invalid={!!errors.wallet_id}
            />
          )}
        />
        <FieldError errors={errors.wallet_id ? [errors.wallet_id] : undefined} />
      </Field>

      <Field data-invalid={!!errors.amount}>
        <FieldLabel htmlFor={`${idPrefix}-amount`}>Montant (DZD)</FieldLabel>
        <Input
          id={`${idPrefix}-amount`}
          inputMode="decimal"
          placeholder="0"
          aria-invalid={!!errors.amount}
          {...register("amount")}
        />
        <FieldError errors={errors.amount ? [errors.amount] : undefined} />
      </Field>

      <Field data-invalid={!!errors.delivery_company_integration_id}>
        <FieldLabel>Partenaire de livraison</FieldLabel>
        <Controller
          control={control}
          name="delivery_company_integration_id"
          render={({ field }) => (
            <DeliveryPartnerSelect
              value={field.value}
              onChange={field.onChange}
              invalid={!!errors.delivery_company_integration_id}
            />
          )}
        />
        <FieldError
          errors={
            errors.delivery_company_integration_id ? [errors.delivery_company_integration_id] : undefined
          }
        />
      </Field>

      <Field data-invalid={!!errors.remark}>
        <FieldLabel htmlFor={`${idPrefix}-remark`}>Remarque</FieldLabel>
        <Input
          id={`${idPrefix}-remark`}
          placeholder="Remarque (optionnel)"
          aria-invalid={!!errors.remark}
          {...register("remark")}
        />
        <FieldError errors={errors.remark ? [errors.remark] : undefined} />
      </Field>
    </FieldGroup>
  )
}
