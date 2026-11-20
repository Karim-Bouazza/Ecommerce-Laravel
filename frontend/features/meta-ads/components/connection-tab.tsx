"use client"

import { useEffect, useState } from "react"
import { Check, CheckCircle2, Copy } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useDisconnectMeta,
  useMetaConnection,
  useSaveMetaApp,
  useSelectMetaAdAccount,
  useStartMetaOAuth,
  useTestMetaConnection,
} from "@/features/meta-ads/hooks/use-meta-ads"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" })

const STEPS = [
  "Sur developers.facebook.com, créez une application de type Business.",
  "Ajoutez le produit Facebook Login.",
  "Collez l'adresse de redirection ci-contre dans « Valid OAuth Redirect URIs ».",
  "Copiez l'ID et la clé secrète (Paramètres → Général) dans le formulaire.",
  "Cliquez sur « Se connecter avec Meta » et autorisez l'accès.",
]

function AppCard() {
  const { data: connection } = useMetaConnection()
  const save = useSaveMetaApp()
  const [appId, setAppId] = useState("")
  const [secret, setSecret] = useState("")
  const [redirectUri, setRedirectUri] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/admin/adpilot/publicite/callback`)
  }, [])

  useEffect(() => {
    if (connection?.app_id) setAppId(connection.app_id)
  }, [connection?.app_id])

  const configured = Boolean(connection?.app_id && connection.has_secret)

  async function copy() {
    await navigator.clipboard.writeText(redirectUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>1. Application Meta</CardTitle>
          <CardDescription>
            Renseignez les identifiants de votre application Meta (Facebook Login).
          </CardDescription>
        </div>
        {configured && (
          <Badge variant="secondary">
            <CheckCircle2 className="size-3" /> Renseignée
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            save.mutate(
              { app_id: appId.trim(), app_secret: secret.trim() || undefined },
              { onSuccess: () => setSecret("") }
            )
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-app-id">ID de l&apos;application Meta</Label>
            <Input id="meta-app-id" value={appId} onChange={(e) => setAppId(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-app-secret">Clé secrète de l&apos;application</Label>
            <Input
              id="meta-app-secret"
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder={connection?.has_secret ? "Clé enregistrée (laisser vide pour la conserver)" : ""}
              required={!connection?.has_secret}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Adresse de redirection OAuth</Label>
            <div className="flex gap-2">
              <Input readOnly value={redirectUri} className="font-mono" />
              <Button type="button" variant="outline" size="icon" aria-label="Copier" onClick={copy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Ajoutez exactement cette adresse dans « Valid OAuth Redirect URIs » de votre
              application Meta.
            </p>
          </div>
          <div>
            <Button type="submit" disabled={save.isPending}>
              Enregistrer l&apos;application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function OAuthCard() {
  const { data: connection } = useMetaConnection()
  const start = useStartMetaOAuth()
  const select = useSelectMetaAdAccount()
  const test = useTestMetaConnection()
  const disconnect = useDisconnectMeta()

  const configured = Boolean(connection?.app_id && connection.has_secret)
  const accounts = connection?.ad_accounts ?? []
  const labelById = new Map(accounts.map((a) => [a.id, `${a.name ?? a.id} (${a.currency ?? "?"})`]))

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>2. Connexion OAuth 2.0</CardTitle>
          <CardDescription>
            Autorisez la lecture de vos dépenses publicitaires (permission ads_read).
          </CardDescription>
        </div>
        {connection?.connected ? (
          <Badge variant="secondary">
            <CheckCircle2 className="size-3" /> Connecté
          </Badge>
        ) : connection?.expired ? (
          <Badge variant="destructive">Expirée</Badge>
        ) : (
          <Badge variant="outline">Non connecté</Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {connection?.connected && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                  COMPTE PUBLICITAIRE
                </span>
                <span>
                  {connection.ad_account?.name ?? "—"}{" "}
                  <span className="text-muted-foreground">{connection.ad_account?.id}</span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                  VALIDITÉ
                </span>
                <span>
                  {connection.expires_at
                    ? `Jusqu'au ${dateFormatter.format(new Date(connection.expires_at))}`
                    : "—"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Compte publicitaire à suivre</Label>
              <Select
                value={connection.ad_account?.id}
                disabled={select.isPending}
                onValueChange={(next) => next && select.mutate(next)}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Sélectionner un compte">
                    {(val: string | null) => (val ? (labelById.get(val) ?? val) : "Sélectionner un compte")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name ?? account.id} ({account.currency ?? "?"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {connection.ad_account?.currency && connection.ad_account.currency !== "USD" && (
                <p className="text-sm text-destructive">
                  Ce compte est en {connection.ad_account.currency} : la conversion ×{connection.rate}{" "}
                  suppose des montants en USD.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" disabled={test.isPending} onClick={() => test.mutate()}>
                Tester la connexion
              </Button>
              <Button
                variant="destructive"
                disabled={disconnect.isPending}
                onClick={() => disconnect.mutate()}
              >
                Déconnecter
              </Button>
            </div>
          </>
        )}

        <div>
          <Button
            disabled={!configured || start.isPending}
            onClick={() => start.mutate()}
          >
            {connection?.connected || connection?.expired ? "Reconnecter avec Meta" : "Se connecter avec Meta"}
          </Button>
          {!configured && (
            <p className="mt-2 text-sm text-muted-foreground">
              Enregistrez d&apos;abord l&apos;application Meta ci-dessus.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ConnectionTab() {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <AppCard />
        <OAuthCard />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Créer l&apos;application Meta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-xs">
            L&apos;accès est en lecture seule. La clé secrète et le jeton sont stockés chiffrés et
            ne sont jamais réaffichés. La connexion dure environ 60 jours.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
