"use client"

import { Link2, Link2Off, Megaphone, RefreshCw, type LucideIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMetaSpend, useRefreshMetaSpend } from "@/features/meta-ads/hooks/use-meta-ads"
import type { MetaDateRange } from "@/features/meta-ads/types"
import { getErrorMessage } from "@/lib/api"
import { formatPrice } from "@/shared/lib/format-price"

const usdFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" })

type StatProps = { label: string; value: string; icon: LucideIcon; highlighted?: boolean }

function Stat({ label, value, icon: Icon, highlighted }: StatProps) {
  return (
    <Card className={cn(highlighted && "ring-2 ring-primary")}>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</span>
          <span className="text-xl font-semibold">{value}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function SpendTab({ range }: { range: MetaDateRange }) {
  const { data, isPending, error } = useMetaSpend(range)
  const refresh = useRefreshMetaSpend(range)

  if (error) {
    return (
      <Card>
        <CardContent className="text-sm text-muted-foreground">
          {getErrorMessage(error)} — vérifiez l&apos;onglet Connexion.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          highlighted
          label="DÉPENSE META TOTALE"
          icon={Megaphone}
          value={data ? (formatPrice(data.total_dzd) ?? "—") : "…"}
        />
        <Stat
          label="ASSOCIÉE À UN PRODUIT"
          icon={Link2}
          value={data ? (formatPrice(data.linked_dzd) ?? "—") : "…"}
        />
        <Stat
          label="NON ASSOCIÉE"
          icon={Link2Off}
          value={data ? (formatPrice(data.unlinked_dzd) ?? "—") : "…"}
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Dépense par produit</CardTitle>
            <CardDescription>Données récupérées en direct depuis Meta.</CardDescription>
          </div>
          <Button variant="secondary" disabled={refresh.isPending} onClick={() => refresh.mutate()}>
            <RefreshCw className={cn("size-4", refresh.isPending && "motion-safe:animate-spin")} />
            Actualiser
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Produit</TableHead>
                <TableHead className="text-right">Dépense (USD)</TableHead>
                <TableHead className="pr-6 text-right">Dépense (DZD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={3} className="pl-6 text-muted-foreground">
                    Chargement…
                  </TableCell>
                </TableRow>
              ) : data && data.products.length > 0 ? (
                data.products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell className="pl-6 font-medium">{product.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {usdFormatter.format(product.usd)}
                    </TableCell>
                    <TableCell className="pr-6 text-right">{formatPrice(product.dzd)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="pl-6 text-muted-foreground">
                    Aucune dépense associée à un produit sur cette période.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Taux appliqué : 1 $ = {data?.rate ?? 255} DZD. Cette dépense est ajoutée aux charges dans
        les analyses produits ; ne la saisissez pas aussi comme charge marketing pour éviter un
        double comptage.
      </p>
    </div>
  )
}
