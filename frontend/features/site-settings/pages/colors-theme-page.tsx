"use client"

import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { ColorField } from "@/features/site-settings/components/color-field"
import { useColorsTheme } from "@/features/site-settings/hooks/use-colors-theme"
import { useUpdateColorsTheme } from "@/features/site-settings/hooks/use-update-colors-theme"
import type { SiteColorsTheme } from "@/features/site-settings/types"

export function ColorsThemePage() {
  const { data, isLoading } = useColorsTheme()

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-130 w-full" />
        <Skeleton className="h-55 w-full" />
      </div>
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

  // The preview reflects the last saved theme, not the in-progress edits —
  // it only updates once "Enregistrer" succeeds.
  const previewStyle = {
    "--brand-950": theme.primary_dark_color,
    "--brand-700": theme.primary_mid_color,
    "--brand-500": theme.primary_color,
    "--brand-300": theme.accent_color,
    "--brand-200": theme.accent_light_color,
    "--brand-white": theme.contrast_color,
  } as CSSProperties

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle>Couleurs du site</CardTitle>
          <CardDescription>
            Ces couleurs pilotent tout le thème de la boutique en ligne (boutons, liens, dégradés,
            badges…). Le back-office admin n&apos;est pas affecté.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-5">
            <ColorField
              control={control}
              name="primary_color"
              label="Couleur principale"
              description="Boutons, liens et éléments mis en avant sur tout le site."
              error={errors.primary_color}
            />
            <ColorField
              control={control}
              name="primary_dark_color"
              label="Couleur principale (foncée)"
              description="Point de départ des dégradés et zones plus sombres."
              error={errors.primary_dark_color}
            />
            <ColorField
              control={control}
              name="primary_mid_color"
              label="Couleur principale (intermédiaire)"
              description="Nuance intermédiaire utilisée dans les dégradés et surlignages."
              error={errors.primary_mid_color}
            />
            <ColorField
              control={control}
              name="accent_color"
              label="Couleur d'accent"
              description="Mises en avant secondaires, promotions, nouveautés."
              error={errors.accent_color}
            />
            <ColorField
              control={control}
              name="accent_light_color"
              label="Couleur d'accent (claire)"
              description="Version claire de l'accent, pour les dégradés et surbrillances."
              error={errors.accent_light_color}
            />
            <ColorField
              control={control}
              name="contrast_color"
              label="Couleur de contraste"
              description="Texte affiché par-dessus une couleur pleine (ex. sur un bouton)."
              error={errors.contrast_color}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aperçu</CardTitle>
          <CardDescription>Rendu approximatif sur la boutique.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={previewStyle} className="space-y-3 rounded-xl border p-4">
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-sm font-semibold"
              style={{ background: "var(--brand-500)", color: "var(--brand-white)" }}
            >
              Ajouter au panier
            </button>
            <div
              className="h-14 rounded-lg"
              style={{ background: "var(--gradient-brand-logo)" }}
            />
            <div
              className="h-10 rounded-lg"
              style={{ background: "var(--gradient-brand-swoosh)" }}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
