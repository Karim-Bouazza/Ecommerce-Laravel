"use client"

import type { LucideIcon } from "lucide-react"
import { BadgeDollarSign, CircleCheck, ShoppingCart, Truck } from "lucide-react"
import { cn } from "cn"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardViewMode } from "@/features/dashboard/components/dashboard-toolbar"
import type { DashboardData, DashboardMetric } from "@/features/dashboard/types"

const numberFormatter = new Intl.NumberFormat("fr-FR")
const percentFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 })

type StatCardProps = {
  label: string
  icon: LucideIcon
  tone: string
  value: string | undefined
  unit?: string
}

function StatCard({ label, icon: Icon, tone, value, unit }: StatCardProps) {
  return (
    <Card className="flex-row items-center gap-4 px-4">
      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {value === undefined ? (
          <Skeleton className="mt-1 h-7 w-20" />
        ) : (
          <p className="text-2xl font-bold tabular-nums">
            {value}
            {unit ? (
              <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
            ) : null}
          </p>
        )}
      </div>
    </Card>
  )
}

export function DashboardStatCards({
  stats,
  viewMode,
}: {
  stats: DashboardData["stats"] | undefined
  viewMode: DashboardViewMode
}) {
  const metric = (value: DashboardMetric | undefined) => {
    if (!value) return undefined
    return viewMode === "percentage"
      ? `${percentFormatter.format(value.percentage)}%`
      : numberFormatter.format(value.count)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total des commandes"
        icon={ShoppingCart}
        tone="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        value={metric(stats?.total_orders)}
      />
      <StatCard
        label="Commandes confirmées"
        icon={CircleCheck}
        tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        value={metric(stats?.confirmed_orders)}
      />
      <StatCard
        label="Commandes livrées"
        icon={Truck}
        tone="bg-teal-500/10 text-teal-600 dark:text-teal-400"
        value={metric(stats?.delivered_orders)}
      />
      <StatCard
        label="Ventes"
        icon={BadgeDollarSign}
        tone="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        value={stats ? numberFormatter.format(stats.sales.amount) : undefined}
        unit="DZD"
      />
    </div>
  )
}
