"use client"

import * as React from "react"
import { Controller } from "react-hook-form"
import { ArrowDownToLine } from "lucide-react"

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
import { useDepositToWallet } from "@/features/wallets/hooks/use-deposit-to-wallet"
import type { Wallet } from "@/features/wallets/types"

type DepositToWalletDialogProps = {
  wallet: Wallet
}

export function DepositToWalletDialog({ wallet }: DepositToWalletDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useDepositToWallet(wallet.id, () => setOpen(false))
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset()
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Entrée"
            className="text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
          />
        }
      >
        <ArrowDownToLine className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Entrée</DialogTitle>
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

            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="deposit-amount">Montant (DZD)</FieldLabel>
              <Input
                id="deposit-amount"
                inputMode="decimal"
                placeholder="0"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              <FieldError errors={errors.amount ? [errors.amount] : undefined} />
            </Field>

            <Field data-invalid={!!errors.remark}>
              <FieldLabel htmlFor="deposit-remark">Remarque</FieldLabel>
              <Input
                id="deposit-remark"
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
              {isSubmitting ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
