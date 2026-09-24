"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LogoUploader } from "@/features/site-settings/components/logo-uploader"
import { useLogo } from "@/features/site-settings/hooks/use-logo"

export function LogoPage() {
  const { data, isLoading } = useLogo()

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full max-w-xl" />
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Logo du site</CardTitle>
        <CardDescription>
          Ce logo est affiché dans l&apos;en-tête de la boutique en ligne. Format recommandé :
          image large (ratio 3:1), fond transparent de préférence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LogoUploader logo={data} />
      </CardContent>
    </Card>
  )
}
