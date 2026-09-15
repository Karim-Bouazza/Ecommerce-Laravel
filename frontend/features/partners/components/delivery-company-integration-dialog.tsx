"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useDeliveryCompanyIntegration } from "@/features/partners/hooks/use-delivery-company-integration"
import { useSaveDeliveryCompanyIntegration } from "@/features/partners/hooks/use-save-delivery-company-integration"

type DeliveryCompanyIntegrationDialogProps = {
  companyKey: string
  entreprise: string
  trigger: React.ReactElement
  /** Set to false when `trigger` doesn't render a native `<button>` (e.g. a Card). */
  nativeButton?: boolean
  children: React.ReactNode
}

export function DeliveryCompanyIntegrationDialog({
  companyKey,
  entreprise,
  trigger,
  nativeButton = true,
  children,
}: DeliveryCompanyIntegrationDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { data: integration } = useDeliveryCompanyIntegration(companyKey)
  const { form, onSubmit, isSubmitting } = useSaveDeliveryCompanyIntegration(companyKey, () =>
    setOpen(false)
  )
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
        reset(nextOpen ? { name: integration?.name ?? "", api_token: "" } : undefined)
      }}
    >
      <DialogTrigger render={trigger} nativeButton={nativeButton}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Intégration {entreprise}</DialogTitle>
          </DialogHeader>

          <FieldGroup className="gap-4 py-4">
            <Field>
              <FieldLabel>Entreprise</FieldLabel>
              <Input value={entreprise} readOnly disabled />
            </Field>

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="integration-name">Nom</FieldLabel>
              <Input
                id="integration-name"
                placeholder="Nom de l'intégration"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.api_token}>
              <FieldLabel htmlFor="integration-api-token">Jeton API</FieldLabel>
              <Input
                id="integration-api-token"
                type="password"
                placeholder="Jeton API"
                aria-invalid={!!errors.api_token}
                {...register("api_token")}
              />
              <FieldError errors={errors.api_token ? [errors.api_token] : undefined} />
              {integration?.has_token ? (
                <FieldDescription>
                  Un jeton est déjà enregistré. Le saisir à nouveau le remplacera.
                </FieldDescription>
              ) : null}
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
