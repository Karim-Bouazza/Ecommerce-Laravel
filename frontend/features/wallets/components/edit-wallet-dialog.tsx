"use client"

import * as React from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { useUpdateWallet } from "@/features/wallets/hooks/use-update-wallet"
import type { Wallet } from "@/features/wallets/types"

type EditWalletDialogProps = {
  wallet: Wallet
}

export function EditWalletDialog({ wallet }: EditWalletDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateWallet(wallet, () => setOpen(false))
  const {
    register,
    reset,
    formState: { errors },
  } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        reset(nextOpen ? { name: wallet.name, remark: wallet.remark ?? "" } : undefined)
      }}
    >
      <DialogTrigger
        render={<Button variant="ghost" size="icon" aria-label="Modifier" />}
      >
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier le portefeuille</DialogTitle>
          </DialogHeader>

          <FieldGroup className="gap-4 py-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-wallet-name">Nom</FieldLabel>
              <Input
                id="edit-wallet-name"
                placeholder="Nom du portefeuille"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.remark}>
              <FieldLabel htmlFor="edit-wallet-remark">Remarque</FieldLabel>
              <Input
                id="edit-wallet-remark"
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
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
