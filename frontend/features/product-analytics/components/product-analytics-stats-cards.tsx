"use client"

import { Percent, ShoppingCart, TrendingUp, Wallet } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/shared/lib/format-price"
import type { GetProductAnalyticsStatsParams } from "@/features/product-analytics/api/product-analytics-api"
import { useProductAnalyticsStats } from "@/features/product-analytics/hooks/use-product-analytics-stats"
import type { ProductAnalyticsStats } from "@/features/product-analytics/types"

const quantityFormatter = new Intl.NumberFormat("fr-FR")
const percentFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const stats = [
  {
    key: "nombre_commandes" as const,
    label: "NOMBRE DE COMMANDES",
    icon: ShoppingCart,
    iconClassName: "bg-primary/10 text-primary",
    format: (data: ProductAnalyticsStats) => quantityFormatter.format(data.nombre_commandes.count),
  },
  {
    key: "ventes" as const,
    label: "VENTES",
    icon: Wallet,
    iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    format: (data: ProductAnalyticsStats) => formatPrice(data.ventes) ?? "—",
  },
  {
    key: "marge_brute" as const,
    label: "MARGE BRUTE",
    icon: TrendingUp,
    iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    format: (data: ProductAnalyticsStats) => formatPrice(data.marge_brute) ?? "—",
  },
  {
    key: "profit_pourcentage" as const,
    label: "PROFIT",
    icon: Percent,
    iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    format: (data: ProductAnalyticsStats) => `${percentFormatter.format(data.profit_pourcentage)} %`,
  },
]

export function ProductAnalyticsStatsCards({ params }: { params: GetProductAnalyticsStatsParams }) {
  const { data, isPending } = useProductAnalyticsStats(params)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, iconClassName, format }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-lg",
                iconClassName
              )}
            >
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</span>
              <span className="text-xl font-semibold">
                {isPending || data === undefined ? "…" : format(data)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
