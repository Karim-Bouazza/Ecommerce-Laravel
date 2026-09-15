"use client"

import * as React from "react"
import { Plus } from "lucide-react"

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
import { useCreateWallet } from "@/features/wallets/hooks/use-create-wallet"

export function CreateWalletDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateWallet(() => setOpen(false))
  const {
    register,
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
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Nouveau portefeuille
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Nouveau portefeuille</DialogTitle>
          </DialogHeader>

          <FieldGroup className="gap-4 py-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="wallet-name">Nom</FieldLabel>
              <Input
                id="wallet-name"
                placeholder="Nom du portefeuille"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.remark}>
              <FieldLabel htmlFor="wallet-remark">Remarque</FieldLabel>
              <Input
                id="wallet-remark"
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
