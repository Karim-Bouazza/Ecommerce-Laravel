"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { SalesChannelChart } from "@/features/sales-channel-analysis/types"

const SERIES_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]

function formatBucket(date: string, granularity: SalesChannelChart["granularity"]): string {
  return granularity === "month"
    ? format(new Date(`${date}-01`), "MMM yyyy", { locale: fr })
    : format(new Date(date), "dd/MM", { locale: fr })
}

export function SalesChannelChartCard({ data }: { data: SalesChannelChart | undefined }) {
  const config = Object.fromEntries(
    (data?.series ?? []).map((series, index) => [
      series.key,
      { label: series.label, color: SERIES_COLORS[index % SERIES_COLORS.length] },
    ])
  ) satisfies ChartConfig

  return (
    <Card aria-busy={data === undefined}>
      <CardHeader>
        <CardTitle>Commandes</CardTitle>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="h-72 w-full" />
        ) : data.points.length === 0 ? (
          <p className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            Aucune commande sur cette période.
          </p>
        ) : (
          <ChartContainer config={config} className="aspect-auto h-72 w-full">
            <BarChart data={data.points} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tickFormatter={(value: string) => formatBucket(value, data.granularity)}
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatBucket(String(value), data.granularity)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {data.series.map((series) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  fill={`var(--color-${series.key})`}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
