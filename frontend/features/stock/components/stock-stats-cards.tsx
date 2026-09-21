"use client"

import { Boxes, Wallet, Truck } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/shared/lib/format-price"
import type { GetStockStatsParams } from "@/features/stock/api/stock-api"
import { useStockStats } from "@/features/stock/hooks/use-stock-stats"

const quantityFormatter = new Intl.NumberFormat("fr-FR")

const stats = [
  {
    key: "confirme_sans_stock" as const,
    label: "CONFIRMÉ SANS STOCK",
    icon: Boxes,
    iconClassName: "bg-destructive/10 text-destructive",
    format: (value: number) => quantityFormatter.format(value),
  },
  {
    key: "valeur_du_stock" as const,
    label: "VALEUR DU STOCK",
    icon: Wallet,
    iconClassName: "bg-primary/10 text-primary",
    format: (value: number) => formatPrice(value) ?? "—",
  },
  {
    key: "valeur_en_livraison" as const,
    label: "VALEUR EN LIVRAISON",
    icon: Truck,
    iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    format: (value: number) => formatPrice(value) ?? "—",
  },
]

export function StockStatsCards({ params }: { params: GetStockStatsParams }) {
  const { data, isPending } = useStockStats(params)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ key, label, icon: Icon, iconClassName, format }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4">
            <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", iconClassName)}>
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</span>
              <span className="text-xl font-semibold">
                {isPending || data === undefined ? "…" : format(data[key])}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
