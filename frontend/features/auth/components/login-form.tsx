"use client"

import { useState } from "react"
import Image from "next/image"
import { Controller } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"

import { useLogin } from "@/features/auth/hooks/use-login"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const { form, onSubmit, isSubmitting } = useLogin()
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-2xl border border-brand-500/15 shadow-sm [--card-spacing:1.75rem]">
        <CardHeader className="items-center justify-center pb-2">
          <Image
            src="/logo.png"
            alt="CodAvenir"
            width={2172}
            height={724}
            priority
            className="h-25 w-auto"
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup className="gap-5">
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className="text-sm">
                  Adresse e-mail
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@example.com"
                  autoComplete="username"
                  className="h-9 rounded-md px-3.5"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={errors.email ? [errors.email] : undefined} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-sm">
                    Mot de passe
                  </FieldLabel>
                  <a
                    href="#"
                    className="text-sm font-medium text-brand-500 hover:text-brand-700"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    className="h-9 rounded-md px-3.5 pr-10"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <FieldError errors={errors.password ? [errors.password] : undefined} />
              </Field>
              <Field orientation="horizontal">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      checked={field.value ?? false}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  )}
                />
                <FieldLabel htmlFor="remember" className="text-sm font-normal">
                  Se souvenir de moi
                </FieldLabel>
              </Field>
              <Field className="mt-5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 rounded-md bg-brand-700  text-white hover:bg-brand-950 disabled:opacity-70"
                >
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
