"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Controller } from "react-hook-form"
import { Camera, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useUpdateProfile } from "@/features/auth/hooks/use-update-profile"
import { getInitials } from "@/features/auth/lib/get-initials"
import type { User } from "@/features/auth/types"

export function ProfileForm({ user }: { user: User }) {
  const { form, onSubmit, isSubmitting } = useUpdateProfile(user)
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form

  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarFile = watch("avatar")

  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile]
  )

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Card>
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <div className="relative">
                <Avatar className="size-24">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt={user.name} />
                  ) : (
                    user.avatar && <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Changer la photo de profil"
                  className="absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background hover:bg-primary/80"
                >
                  <Camera className="size-4" />
                </button>
                <input
                  ref={(node) => {
                    ref(node)
                    fileInputRef.current = node
                  }}
                  type="file"
                  accept="image/*"
                  name={name}
                  onBlur={onBlur}
                  className="hidden"
                  onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                />
              </div>
            )}
          />
          <FieldError errors={errors.avatar ? [errors.avatar] : undefined} />

          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {user.role && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {user.role.name}
            </span>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modifier le profil</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Nom</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <UserIcon />
                  </InputGroupAddon>
                  <InputGroupInput id="name" aria-invalid={!!errors.name} {...register("name")} />
                </InputGroup>
                <FieldError errors={errors.name ? [errors.name] : undefined} />
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">Numéro de téléphone</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Phone />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="phone"
                    aria-invalid={!!errors.phone}
                    {...register("phone")}
                  />
                </InputGroup>
                <FieldError errors={errors.phone ? [errors.phone] : undefined} />
              </Field>
            </div>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </InputGroup>
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </Field>

            <FieldSeparator>Sécurité</FieldSeparator>

            <Field data-invalid={!!errors.current_password}>
              <FieldLabel htmlFor="current_password">Mot de passe actuel</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  id="current_password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Requis pour changer de mot de passe"
                  aria-invalid={!!errors.current_password}
                  {...register("current_password")}
                />
              </InputGroup>
              <FieldError
                errors={errors.current_password ? [errors.current_password] : undefined}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Nouveau mot de passe</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez le mot de passe"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                      }
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={errors.password ? [errors.password] : undefined} />
              </Field>

              <Field data-invalid={!!errors.password_confirmation}>
                <FieldLabel htmlFor="password_confirmation">
                  Confirmation du mot de passe
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez le mot de passe"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password_confirmation}
                    {...register("password_confirmation")}
                  />
                </InputGroup>
                <FieldError
                  errors={
                    errors.password_confirmation ? [errors.password_confirmation] : undefined
                  }
                />
              </Field>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  )
}
