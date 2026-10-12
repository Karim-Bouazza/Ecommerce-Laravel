"use client"

import type { CSSProperties } from "react"
import { Palette } from "lucide-react"
import { useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"
import { ColorField } from "@/features/site-settings/components/color-field"
import { useColorsTheme } from "@/features/site-settings/hooks/use-colors-theme"
import { useUpdateColorsTheme } from "@/features/site-settings/hooks/use-update-colors-theme"
import type { SiteColorsTheme } from "@/features/site-settings/types"

export function ColorsThemePage() {
  const { data, isLoading } = useColorsTheme()

  if (isLoading || !data) {
    return (
      <SettingsPageShell
        icon={Palette}
        title="Couleurs du site"
        description="Ces couleurs pilotent le thème de la boutique en ligne."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <Skeleton className="h-130 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </SettingsPageShell>
    )
  }

  return <ColorsThemeForm theme={data} />
}

function ColorsThemeForm({ theme }: { theme: SiteColorsTheme }) {
  const { form, onSubmit, isSubmitting } = useUpdateColorsTheme(theme)
  const {
    control,
    formState: { errors, isDirty },
  } = form

  const values = useWatch({ control })
  const HEX = /^#[0-9A-Fa-f]{6}$/
  const pick = (value: string | undefined, saved: string) =>
    value && HEX.test(value) ? value : saved

  // Live preview: follows edits as soon as they are valid hex colors.
  const previewStyle = {
    "--brand-950": pick(values.primary_dark_color, theme.primary_dark_color),
    "--brand-700": pick(values.primary_mid_color, theme.primary_mid_color),
    "--brand-500": pick(values.primary_color, theme.primary_color),
    "--brand-300": pick(values.accent_color, theme.accent_color),
    "--brand-200": pick(values.accent_light_color, theme.accent_light_color),
    "--brand-white": pick(values.contrast_color, theme.contrast_color),
  } as CSSProperties

  return (
    <SettingsPageShell
      icon={Palette}
      title="Couleurs du site"
      description="Ces couleurs pilotent tout le thème de la boutique en ligne (boutons, liens, dégradés, badges…). Le back-office admin n'est pas affecté."
    >
      <form onSubmit={onSubmit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Couleur principale</CardTitle>
              <CardDescription>La base de l&apos;identité visuelle de la boutique.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-5">
                <ColorField
                  control={control}
                  name="primary_color"
                  label="Principale"
                  description="Boutons, liens et éléments mis en avant sur tout le site."
                  error={errors.primary_color}
                />
                <ColorField
                  control={control}
                  name="primary_dark_color"
                  label="Principale (foncée)"
                  description="Point de départ des dégradés et zones plus sombres."
                  error={errors.primary_dark_color}
                />
                <ColorField
                  control={control}
                  name="primary_mid_color"
                  label="Principale (intermédiaire)"
                  description="Nuance utilisée dans les dégradés et surlignages."
                  error={errors.primary_mid_color}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accent et contraste</CardTitle>
              <CardDescription>Mises en avant secondaires et lisibilité du texte.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-5">
                <ColorField
                  control={control}
                  name="accent_color"
                  label="Accent"
                  description="Promotions, nouveautés et mises en avant secondaires."
                  error={errors.accent_color}
                />
                <ColorField
                  control={control}
                  name="accent_light_color"
                  label="Accent (clair)"
                  description="Version claire de l'accent, pour les dégradés et surbrillances."
                  error={errors.accent_light_color}
                />
                <ColorField
                  control={control}
                  name="contrast_color"
                  label="Contraste"
                  description="Texte affiché par-dessus une couleur pleine (ex. sur un bouton)."
                  error={errors.contrast_color}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {isDirty ? "Modifications non enregistrées" : "Aucune modification"}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || isSubmitting}
                onClick={() => form.reset(theme)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>

        <Card className="lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="text-base">Aperçu en direct</CardTitle>
            <CardDescription>Rendu approximatif sur la boutique.</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={previewStyle} className="space-y-3 rounded-xl border bg-background p-4">
              <button
                type="button"
                tabIndex={-1}
                className="w-full rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: "var(--brand-500)", color: "var(--brand-white)" }}
              >
                Ajouter au panier
              </button>
              <div className="flex gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: "var(--brand-300)", color: "var(--brand-950)" }}
                >
                  -30%
                </span>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: "var(--brand-200)", color: "var(--brand-950)" }}
                >
                  Nouveau
                </span>
              </div>
              <div className="h-14 rounded-lg" style={{ background: "linear-gradient(135deg, var(--brand-950), var(--brand-500))" }} />
              <div className="h-10 rounded-lg" style={{ background: "linear-gradient(135deg, var(--brand-300), var(--brand-200))" }} />
            </div>
          </CardContent>
        </Card>
      </form>
    </SettingsPageShell>
  )
}
