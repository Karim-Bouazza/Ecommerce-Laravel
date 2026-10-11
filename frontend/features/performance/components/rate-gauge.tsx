"use client"

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const percentFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 })

/** Colour follows the value, and the figure is always printed next to it. */
function toneFor(value: number) {
  if (value >= 70) return { fill: "var(--color-emerald-500)", text: "text-emerald-600 dark:text-emerald-400" }
  if (value >= 40) return { fill: "var(--color-amber-500)", text: "text-amber-600 dark:text-amber-400" }
  return { fill: "var(--color-red-500)", text: "text-destructive" }
}

const config = { value: { label: "Taux" } } satisfies ChartConfig

type RateGaugeProps = {
  label: string
  value: number | undefined
  loading?: boolean
}

export function RateGauge({ label, value, loading }: RateGaugeProps) {
  const rate = value ?? 0
  const tone = toneFor(rate)

  return (
    <figure
      className="flex flex-col items-center gap-1"
      role="img"
      aria-label={loading ? `${label}, chargement` : `${label} : ${percentFormatter.format(rate)} %`}
    >
      {loading ? (
        <Skeleton className="size-40 rounded-full" />
      ) : (
        <div className="relative size-40">
          <ChartContainer config={config} className="size-full">
            <RadialBarChart
              data={[{ value: rate, fill: tone.fill }]}
              startAngle={90}
              endAngle={-270}
              innerRadius="78%"
              outerRadius="100%"
              barSize={14}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
              <RadialBar
                dataKey="value"
                angleAxisId={0}
                cornerRadius={8}
                background={{ fill: "var(--color-muted)" }}
                isAnimationActive
                animationDuration={600}
              />
            </RadialBarChart>
          </ChartContainer>
          <span
            className={`absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums ${tone.text}`}
          >
            {percentFormatter.format(rate)}%
          </span>
        </div>
      )}
      <figcaption className="text-sm font-medium text-muted-foreground">{label}</figcaption>
    </figure>
  )
}
