"use client"

import * as React from "react"
import { Controller } from "react-hook-form"
import { ArrowLeftRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker/date-picker"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useTransferWallets } from "@/features/wallets/hooks/use-transfer-wallets"
import { WalletSelect } from "@/features/wallets/components/wallet-select"

export function CreateTransferDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useTransferWallets(() => setOpen(false))
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form

  const fromWalletId = watch("from_wallet_id")

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset()
      }}
    >
      <DialogTrigger render={<Button variant="secondary" />}>
        <ArrowLeftRight className="size-4" />
        Créer un transfert
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Créer un transfert</DialogTitle>
          </DialogHeader>

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

            <Field data-invalid={!!errors.from_wallet_id}>
              <FieldLabel>De (Portefeuille)</FieldLabel>
              <Controller
                control={control}
                name="from_wallet_id"
                render={({ field }) => (
                  <WalletSelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Portefeuille"
                    invalid={!!errors.from_wallet_id}
                  />
                )}
              />
              <FieldError errors={errors.from_wallet_id ? [errors.from_wallet_id] : undefined} />
            </Field>

            <Field data-invalid={!!errors.to_wallet_id}>
              <FieldLabel>À (Portefeuille)</FieldLabel>
              <Controller
                control={control}
                name="to_wallet_id"
                render={({ field }) => (
                  <WalletSelect
                    value={field.value}
                    onChange={field.onChange}
                    excludeId={fromWalletId}
                    placeholder="Portefeuille"
                    invalid={!!errors.to_wallet_id}
                  />
                )}
              />
              <FieldError errors={errors.to_wallet_id ? [errors.to_wallet_id] : undefined} />
            </Field>

            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="transfer-amount">Montant (DZD)</FieldLabel>
              <Input
                id="transfer-amount"
                inputMode="decimal"
                placeholder="0"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              <FieldError errors={errors.amount ? [errors.amount] : undefined} />
            </Field>

            <Field data-invalid={!!errors.remark}>
              <FieldLabel htmlFor="transfer-remark">Remarque</FieldLabel>
              <Input
                id="transfer-remark"
                placeholder="Remarque (optionnel)"
                aria-invalid={!!errors.remark}
                {...register("remark")}
              />
              <FieldError errors={errors.remark ? [errors.remark] : undefined} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Transfert…" : "Transférer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
