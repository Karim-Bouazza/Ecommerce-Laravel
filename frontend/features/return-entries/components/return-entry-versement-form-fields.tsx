"use client"

import { CheckCircle2 } from "lucide-react"
import { Controller, type UseFormReturn } from "react-hook-form"

import { DatePicker } from "@/components/date-picker/date-picker"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/shared/lib/format-price"
import { WalletSelect } from "@/features/wallets/components/wallet-select"
import type { ReturnEntryVersementSchema } from "@/features/return-entries/schemas/return-entry-versement-schema"
import type { ReturnEntry } from "@/features/return-entries/types"

type ReturnEntryVersementFormFieldsProps = {
  entry: ReturnEntry
  form: UseFormReturn<ReturnEntryVersementSchema>
  idPrefix: string
}

export function ReturnEntryVersementFormFields({ entry, form, idPrefix }: ReturnEntryVersementFormFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup className="gap-4 py-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground">TOTAL</p>
          <p className="font-heading text-sm font-semibold">{formatPrice(entry.total)}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
          <p className="text-xs text-emerald-600 dark:text-emerald-400">PAYÉ</p>
          <p className="font-heading text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {formatPrice(entry.paid_amount)}
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
          <p className="text-xs text-amber-600 dark:text-amber-400">RESTANT</p>
          <p className="font-heading text-sm font-semibold text-amber-600 dark:text-amber-400">
            {formatPrice(entry.remaining_amount)}
          </p>
        </div>
      </div>

      <Field data-invalid={!!errors.date}>
        <FieldLabel>Date</FieldLabel>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker value={field.value} onChange={(date) => field.onChange(date ?? field.value)} invalid={!!errors.date} />
          )}
        />
        <FieldError errors={errors.date ? [errors.date] : undefined} />
      </Field>

      <Field data-invalid={!!errors.wallet_id}>
        <FieldLabel>Portefeuille</FieldLabel>
        <Controller
          control={control}
          name="wallet_id"
          render={({ field }) => <WalletSelect value={field.value} onChange={field.onChange} invalid={!!errors.wallet_id} />}
        />
        <FieldError errors={errors.wallet_id ? [errors.wallet_id] : undefined} />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${idPrefix}-amount`}>Montant (DZD)</FieldLabel>
        <Input id={`${idPrefix}-amount`} value={formatPrice(entry.remaining_amount) ?? ""} readOnly disabled />
        <div className="flex items-center gap-2 rounded-md border-l-4 border-emerald-500 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          Le paiement d&rsquo;un retour est toujours intégral — aucun paiement partiel n&rsquo;est autorisé.
        </div>
      </Field>

      <Field data-invalid={!!errors.remark}>
        <FieldLabel htmlFor={`${idPrefix}-remark`}>Remarque</FieldLabel>
        <Input id={`${idPrefix}-remark`} placeholder="Remarque (optionnel)" aria-invalid={!!errors.remark} {...register("remark")} />
        <FieldError errors={errors.remark ? [errors.remark] : undefined} />
      </Field>
    </FieldGroup>
  )
}
