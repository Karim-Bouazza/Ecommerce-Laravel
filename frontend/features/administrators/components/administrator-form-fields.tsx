"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Controller, type UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { AdministratorFormValues } from "@/features/administrators/schemas/administrator-schema"
import type { AdministratorRole } from "@/features/administrators/types"

type AdministratorFormFieldsProps = {
  form: UseFormReturn<AdministratorFormValues>
  roles: AdministratorRole[]
  isLoadingRoles: boolean
  idPrefix: string
  /** Password is mandatory on creation and optional on edition. */
  passwordRequired: boolean
  /** The signed-in administrator cannot change their own role or status. */
  isSelf?: boolean
}

function PasswordInput({
  id,
  invalid,
  autoComplete,
  ...props
}: React.ComponentProps<"input"> & { invalid: boolean }) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete ?? "new-password"}
        aria-invalid={invalid}
        className="pr-10"
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  )
}

export function AdministratorFormFields({
  form,
  roles,
  isLoadingRoles,
  idPrefix,
  passwordRequired,
  isSelf = false,
}: AdministratorFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className="grid gap-4 py-2 sm:grid-cols-2 sm:gap-x-6">
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor={`${idPrefix}-name`}>Nom complet</FieldLabel>
          <Input
            id={`${idPrefix}-name`}
            autoComplete="off"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            inputMode="email"
            autoComplete="off"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor={`${idPrefix}-phone`}>Numéro de téléphone</FieldLabel>
          <Input
            id={`${idPrefix}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="off"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldError errors={errors.phone ? [errors.phone] : undefined} />
        </Field>
      </FieldGroup>

      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.role_id}>
          <FieldLabel htmlFor={`${idPrefix}-role`}>Rôle</FieldLabel>
          <Controller
            control={control}
            name="role_id"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isSelf || isLoadingRoles}
              >
                <SelectTrigger id={`${idPrefix}-role`} className="w-full" aria-invalid={!!errors.role_id}>
                  <SelectValue>
                    {(value: string) =>
                      roles.find((role) => String(role.id) === value)?.name ?? (
                        <span className="text-muted-foreground">
                          {isLoadingRoles ? "Chargement…" : "Sélectionnez un rôle"}
                        </span>
                      )
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {isSelf ? (
            <FieldDescription>Vous ne pouvez pas modifier votre propre rôle.</FieldDescription>
          ) : null}
          <FieldError errors={errors.role_id ? [errors.role_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor={`${idPrefix}-password`}>Mot de passe</FieldLabel>
          <PasswordInput
            id={`${idPrefix}-password`}
            invalid={!!errors.password}
            {...register("password")}
          />
          {!passwordRequired ? (
            <FieldDescription>Laissez vide pour conserver le mot de passe actuel.</FieldDescription>
          ) : null}
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password_confirmation}>
          <FieldLabel htmlFor={`${idPrefix}-password-confirmation`}>Confirmation du mot de passe</FieldLabel>
          <PasswordInput
            id={`${idPrefix}-password-confirmation`}
            invalid={!!errors.password_confirmation}
            {...register("password_confirmation")}
          />
          <FieldError errors={errors.password_confirmation ? [errors.password_confirmation] : undefined} />
        </Field>
      </FieldGroup>

      <Field orientation="horizontal" className="items-center sm:col-span-2">
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <Switch
              id={`${idPrefix}-active`}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSelf}
            />
          )}
        />
        <div className="flex flex-col gap-0.5">
          <FieldLabel htmlFor={`${idPrefix}-active`}>Compte actif</FieldLabel>
          <FieldDescription>
            {isSelf
              ? "Vous ne pouvez pas désactiver votre propre compte."
              : "Un compte désactivé ne peut plus se connecter."}
          </FieldDescription>
        </div>
      </Field>
    </div>
  )
}
