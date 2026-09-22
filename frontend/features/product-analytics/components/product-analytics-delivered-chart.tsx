"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetProductAnalyticsChartParams } from "@/features/product-analytics/api/product-analytics-api"
import { useProductAnalyticsChart } from "@/features/product-analytics/hooks/use-product-analytics-chart"

const chartConfig = {
  commandes_livrees: {
    label: "Commandes livrées",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ProductAnalyticsDeliveredChart({
  params,
}: {
  params: GetProductAnalyticsChartParams
}) {
  const { data, isPending } = useProductAnalyticsChart(params)

  const chartData = [...(data ?? [])].reverse()
  const rowHeight = 36
  const chartHeight = Math.max(chartData.length * rowHeight, rowHeight * 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes livrées par produit</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : chartData.length === 0 ? (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Aucune commande livrée trouvée.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: chartHeight }}
          >
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={140}
                tickFormatter={(value: string) =>
                  value.length > 20 ? `${value.slice(0, 20)}…` : value
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="line" />}
              />
              <Bar
                dataKey="commandes_livrees"
                fill="var(--color-commandes_livrees)"
                radius={4}
                barSize={20}
              >
                <LabelList
                  dataKey="commandes_livrees"
                  position="right"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
