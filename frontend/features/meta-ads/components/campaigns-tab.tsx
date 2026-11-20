"use client"

import { useQuery } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useLinkMetaCampaign,
  useMetaSpend,
  useRefreshMetaSpend,
} from "@/features/meta-ads/hooks/use-meta-ads"
import type { MetaCampaignSpend, MetaDateRange } from "@/features/meta-ads/types"
import { getProducts } from "@/features/products/api/product-api"
import { getErrorMessage } from "@/lib/api"
import { formatPrice } from "@/shared/lib/format-price"

const usdFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" })
const NONE = "none"

function CampaignRow({
  campaign,
  products,
}: {
  campaign: MetaCampaignSpend
  products: { id: number; name: string }[]
}) {
  const link = useLinkMetaCampaign()
  const labelById = new Map(products.map((p) => [String(p.id), p.name]))

  return (
    <TableRow>
      <TableCell className="pl-6 font-medium">{campaign.name}</TableCell>
      <TableCell className="text-right text-muted-foreground">
        {usdFormatter.format(campaign.usd)}
      </TableCell>
      <TableCell className="text-right">{formatPrice(campaign.dzd)}</TableCell>
      <TableCell className="pr-6">
        <Select
          value={campaign.product_id !== null ? String(campaign.product_id) : NONE}
          disabled={link.isPending}
          onValueChange={(next) =>
            link.mutate({
              id: campaign.id,
              name: campaign.name,
              product_id: next === NONE || next === null ? null : Number(next),
            })
          }
        >
          <SelectTrigger className="w-full min-w-56">
            <SelectValue>
              {(val: string | null) =>
                val && val !== NONE ? (labelById.get(val) ?? val) : "Non associée"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Non associée</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={String(product.id)}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  )
}

export function CampaignsTab({ range }: { range: MetaDateRange }) {
  const { data, isPending, error } = useMetaSpend(range)
  const refresh = useRefreshMetaSpend(range)
  const { data: productsPage } = useQuery({
    queryKey: ["meta-ads", "product-options"],
    queryFn: () => getProducts({ per_page: 100 }),
  })
  const products = productsPage?.data ?? []

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Campagnes Meta</CardTitle>
          <CardDescription>
            Associez chaque campagne au produit qu&apos;elle promeut. Seules les campagnes ayant
            dépensé sur la période sont listées.
          </CardDescription>
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
              <TableHead className="pl-6">Campagne</TableHead>
              <TableHead className="text-right">Dépense (USD)</TableHead>
              <TableHead className="text-right">Dépense (DZD)</TableHead>
              <TableHead className="pr-6">Produit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={4} className="pl-6 text-muted-foreground">
                  {getErrorMessage(error)}
                </TableCell>
              </TableRow>
            ) : isPending ? (
              <TableRow>
                <TableCell colSpan={4} className="pl-6 text-muted-foreground">
                  Chargement…
                </TableCell>
              </TableRow>
            ) : data && data.campaigns.length > 0 ? (
              data.campaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} products={products} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="pl-6 text-muted-foreground">
                  Aucune campagne n&apos;a dépensé sur cette période.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
