"use client"

import type { ReactNode } from "react"
import { Wallet } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/shared/lib/format-price"
import { usePerformanceRevenue } from "@/features/performance/hooks/use-performance-revenue"

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function PercentBadge({ value }: { value: number }) {
  const className =
    value >= 0
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "bg-destructive/10 text-destructive"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {percentFormatter.format(value)}%
    </span>
  )
}

function Row({
  label,
  value,
  badge,
}: {
  label: string
  value: ReactNode
  badge?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-base font-semibold">{value}</span>
        {badge}
      </span>
    </div>
  )
}

export function RevenueProfitCard() {
  const { data, isPending } = usePerformanceRevenue()

  const money = (value: number | undefined) =>
    isPending || value === undefined ? "…" : (formatPrice(value) ?? "—")

  return (
    <Card className="p-0">
      <CardHeader className="flex-row items-center gap-3 rounded-t-xl bg-emerald-500/10 px-4 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Wallet className="size-5" />
        </div>
        <CardTitle className="text-emerald-700 dark:text-emerald-400">
          Revenus &amp; Profits
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-4">
        <Row label="Ventes" value={money(data?.ventes)} />
        <Row label="Revenus" value={money(data?.revenus)} />
        <Row
          label="Bénéfices"
          value={money(data?.benefices)}
          badge={
            !isPending && data !== undefined ? (
              <PercentBadge value={data.benefices_pourcentage} />
            ) : undefined
          }
        />
        <Row
          label="Retour sur investissement (ROI)"
          value={isPending || data === undefined ? "…" : `${percentFormatter.format(data.roi)}%`}
        />
        <Row
          label="Upsell"
          value="—"
          badge={
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Bientôt
            </span>
          }
        />
        <Row label="Capital" value={money(data?.capital)} />
      </CardContent>
    </Card>
  )
}
