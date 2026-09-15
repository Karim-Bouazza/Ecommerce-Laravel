"use client"

import * as React from "react"
import { Controller } from "react-hook-form"
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
import { CommuneSelect } from "@/features/wilayas/components/commune-select"
import { WilayaSelect } from "@/features/wilayas/components/wilaya-select"
import { useUpdateClient } from "@/features/clients/hooks/use-update-client"
import type { Client } from "@/features/clients/types"

type EditClientDialogProps = {
  client: Client
}

export function EditClientDialog({ client }: EditClientDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateClient(client, () => setOpen(false))
  const {
    register,
    control,
    watch,
    reset,
    formState: { errors },
  } = form

  const wilayaId = watch("wilaya_id")

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        reset(
          nextOpen
            ? {
                first_name: client.first_name,
                last_name: client.last_name,
                phone_number: client.phone_number,
                wilaya_id: client.wilaya_id,
                commune_id: client.commune_id,
              }
            : undefined
        )
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>

          <FieldGroup className="gap-4 py-4">
            <Field data-invalid={!!errors.first_name}>
              <FieldLabel htmlFor="edit-client-first-name">Prénom</FieldLabel>
              <Input
                id="edit-client-first-name"
                placeholder="Prénom du client"
                aria-invalid={!!errors.first_name}
                {...register("first_name")}
              />
              <FieldError errors={errors.first_name ? [errors.first_name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.last_name}>
              <FieldLabel htmlFor="edit-client-last-name">Nom</FieldLabel>
              <Input
                id="edit-client-last-name"
                placeholder="Nom du client"
                aria-invalid={!!errors.last_name}
                {...register("last_name")}
              />
              <FieldError errors={errors.last_name ? [errors.last_name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.phone_number}>
              <FieldLabel htmlFor="edit-client-phone">Téléphone</FieldLabel>
              <Input
                id="edit-client-phone"
                placeholder="Téléphone du client"
                aria-invalid={!!errors.phone_number}
                {...register("phone_number")}
              />
              <FieldError errors={errors.phone_number ? [errors.phone_number] : undefined} />
            </Field>

            <Field data-invalid={!!errors.wilaya_id}>
              <FieldLabel>Wilaya</FieldLabel>
              <Controller
                control={control}
                name="wilaya_id"
                render={({ field }) => (
                  <WilayaSelect
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      form.setValue("commune_id", null)
                    }}
                    invalid={!!errors.wilaya_id}
                  />
                )}
              />
              <FieldError errors={errors.wilaya_id ? [errors.wilaya_id] : undefined} />
            </Field>

            <Field data-invalid={!!errors.commune_id}>
              <FieldLabel>Commune</FieldLabel>
              <Controller
                control={control}
                name="commune_id"
                render={({ field }) => (
                  <CommuneSelect
                    wilayaId={wilayaId}
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.commune_id}
                  />
                )}
              />
              <FieldError errors={errors.commune_id ? [errors.commune_id] : undefined} />
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
