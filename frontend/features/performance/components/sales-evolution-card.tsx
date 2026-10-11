"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { useSalesEvolution } from "@/features/performance/hooks/use-sales-evolution"
import type { PerformanceFilters } from "@/features/performance/types"
import { formatPrice } from "@/shared/lib/format-price"

type Metric = "ventes" | "capital"

const config = {
  ventes: { label: "Montant", color: "var(--color-emerald-500)" },
  capital: { label: "Capital", color: "var(--color-indigo-500)" },
} satisfies ChartConfig

const dayFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" })
const compactFormatter = new Intl.NumberFormat("fr-FR", { notation: "compact" })

function formatDay(value: string) {
  return dayFormatter.format(new Date(`${value}T00:00:00`))
}

export function SalesEvolutionCard({ filters }: { filters: PerformanceFilters }) {
  const [metric, setMetric] = React.useState<Metric>("ventes")
  const { data, isPending } = useSalesEvolution(filters)
  const series = data?.series ?? []
  const empty = !isPending && series.length === 0

  return (
    <Card aria-busy={isPending}>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Évolution des ventes</CardTitle>
        <Tabs value={metric} onValueChange={(value) => setMetric(value as Metric)}>
          <TabsList aria-label="Indicateur affiché">
            <TabsTab value="ventes">Montant</TabsTab>
            <TabsTab value="capital">Capital</TabsTab>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-72 w-full" />
        ) : empty ? (
          <div className="flex h-72 items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
            Aucune vente livrée sur cette période
          </div>
        ) : (
          <ChartContainer config={config} className="h-72 w-full">
            <AreaChart data={series} margin={{ left: 4, right: 12, top: 8 }}>
              <defs>
                <linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`var(--color-${metric})`} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={`var(--color-${metric})`} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDay}
              />
              <YAxis
                width={48}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => compactFormatter.format(value)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => formatDay(String(label))}
                    formatter={(value) => (
                      <span className="font-semibold tabular-nums">{formatPrice(Number(value))}</span>
                    )}
                  />
                }
              />
              <Area
                dataKey={metric}
                type="monotone"
                stroke={`var(--color-${metric})`}
                strokeWidth={2}
                fill="url(#sales-fill)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
