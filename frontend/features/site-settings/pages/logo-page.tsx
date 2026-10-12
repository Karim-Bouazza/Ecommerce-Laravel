"use client"

import { Image as ImageIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LogoUploader } from "@/features/site-settings/components/logo-uploader"
import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"
import { useLogo } from "@/features/site-settings/hooks/use-logo"

export function LogoPage() {
  const { data, isLoading } = useLogo()

  return (
    <SettingsPageShell
      icon={ImageIcon}
      title="Logo du site"
      description="Affiché dans l'en-tête de la boutique en ligne. Format recommandé : image large (ratio 3:1), fond transparent de préférence."
      className="max-w-3xl"
    >
      {isLoading || !data ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Logo actuel</CardTitle>
            <CardDescription>
              PNG, JPG ou WebP. Vous pourrez recadrer l&apos;image avant de l&apos;enregistrer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogoUploader logo={data} />
          </CardContent>
        </Card>
      )}
    </SettingsPageShell>
  )
}
