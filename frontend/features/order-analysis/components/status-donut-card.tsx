"use client"

import { Cell, Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { BadgeColor } from "@/features/orders/types"
import type { OrderStatusGroup } from "@/features/order-analysis/types"

/** Chart colors per status badge color (same palette as the status badges). */
export const STATUS_CHART_COLORS: Record<BadgeColor, string> = {
  success: "var(--color-emerald-600)",
  danger: "var(--color-red-500)",
  info: "var(--color-blue-500)",
  warning: "var(--color-amber-400)",
  gray: "var(--color-slate-400)",
  indigo: "var(--color-indigo-500)",
  purple: "var(--color-purple-500)",
  primary: "var(--color-cyan-500)",
  orange: "var(--color-orange-400)",
}

const config = {} satisfies ChartConfig

export function StatusDonutCard({ group }: { group: OrderStatusGroup | undefined }) {
  const slices = group?.statuses.filter((status) => status.count > 0) ?? []
  const empty = group !== undefined && slices.length === 0

  return (
    <Card aria-busy={group === undefined}>
      <CardHeader>
        <CardTitle className="text-center">{group?.label ?? <Skeleton className="mx-auto h-5 w-28" />}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {group === undefined ? (
          <Skeleton className="mx-auto size-40 rounded-full" />
        ) : (
          <div className="relative mx-auto size-40">
            <ChartContainer config={config} className="size-40 aspect-square">
              <PieChart>
                <Pie
                  data={empty ? [{ status: "empty", count: 1 }] : slices}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={slices.length > 1 ? 2 : 0}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {empty ? (
                    <Cell fill="var(--color-muted)" />
                  ) : (
                    slices.map((slice) => (
                      <Cell key={slice.status} fill={STATUS_CHART_COLORS[slice.color]} />
                    ))
                  )}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-2xl font-semibold tabular-nums">{group.total}</span>
            </div>
          </div>
        )}

        <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {group?.statuses.map((status) => (
            <li key={status.status} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ backgroundColor: STATUS_CHART_COLORS[status.color] }}
              />
              {status.label}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
