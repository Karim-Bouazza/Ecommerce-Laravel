"use client"

import { cn } from "cn"

import type { BadgeColor, PaginatedResponse } from "@/features/orders/types"

type Stat = NonNullable<PaginatedResponse<unknown>["stats"]>[number]

const dotClasses: Record<BadgeColor, string> = {
  success: "bg-emerald-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-amber-500",
  gray: "bg-zinc-400",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
  primary: "bg-primary",
  orange: "bg-orange-500",
}

const ALL = "all"

type OrderStatusStatsProps = {
  stats: Stat[]
  selected: string
  onSelect: (status: string) => void
  isLoading?: boolean
}

type StatCardProps = {
  label: string
  count: number
  dot: string
  active: boolean
  onClick: () => void
}

function StatCard({ label, count, dot, active, onClick }: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group flex cursor-pointer flex-col gap-2 rounded-xl border bg-card px-4 py-3 text-left shadow-xs transition-all",
        "hover:border-foreground/20 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active && "border-primary bg-primary/5 ring-1 ring-primary"
      )}
    >
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={cn("size-2 shrink-0 rounded-full", dot)} aria-hidden="true" />
        <span className="truncate">{label}</span>
      </span>
      <span className="text-2xl font-semibold tracking-tight tabular-nums">{count}</span>
    </button>
  )
}

export function OrderStatusStats({ stats, selected, onSelect, isLoading }: OrderStatusStatsProps) {
  if (isLoading && stats.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-19.5 animate-pulse rounded-xl border bg-muted/40" />
        ))}
      </div>
    )
  }

  if (stats.length === 0) return null

  const total = stats.reduce((sum, stat) => sum + stat.count, 0)
  const showTotal = stats.length > 1

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {showTotal && (
        <StatCard
          label="Toutes"
          count={total}
          dot="bg-foreground"
          active={selected === ALL}
          onClick={() => onSelect(ALL)}
        />
      )}
      {stats.map((stat) => (
        <StatCard
          key={stat.value}
          label={stat.label}
          count={stat.count}
          dot={dotClasses[stat.color]}
          active={selected === stat.value}
          onClick={() => onSelect(selected === stat.value ? ALL : stat.value)}
        />
      ))}
    </div>
  )
}
