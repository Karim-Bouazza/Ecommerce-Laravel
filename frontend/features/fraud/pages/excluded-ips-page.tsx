"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAbility } from "@/features/auth/lib/ability-provider"
import { ExcludedIpForm } from "@/features/fraud/components/excluded-ip-form"
import { ExcludedIpList } from "@/features/fraud/components/excluded-ip-list"

export function ExcludedIpsPage() {
  const ability = useAbility()
  const canCreate = ability.can("create", "pixels")

  return (
    <div className="flex flex-col gap-4">
      {canCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Exclure une adresse IP du pixel</CardTitle>
            <CardDescription>
              Ces visiteurs peuvent toujours passer commande : seul l&apos;événement d&apos;achat (Purchase) n&apos;est
              pas envoyé aux pixels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExcludedIpForm />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Adresses exclues</CardTitle>
        </CardHeader>
        <CardContent>
          <ExcludedIpList />
        </CardContent>
      </Card>
    </div>
  )
}
