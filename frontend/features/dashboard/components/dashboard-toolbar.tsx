"use client"

import { cn } from "cn"

import { Card } from "@/components/ui/card"
import type { DashboardPeriod } from "@/features/dashboard/types"

export type DashboardPeriodSelection = DashboardPeriod | "custom"
export type DashboardViewMode = "numbers" | "percentage"

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: "all_time", label: "Tout le temps" },
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "last_week", label: "La semaine dernière" },
  { value: "last_month", label: "Le mois dernier" },
]

const VIEW_MODES: { value: DashboardViewMode; label: string }[] = [
  { value: "percentage", label: "Pourcentage %" },
  { value: "numbers", label: "# Nombres" },
]

type DashboardToolbarProps = {
  period: DashboardPeriodSelection
  onPeriodChange: (period: DashboardPeriod) => void
  viewMode: DashboardViewMode
  onViewModeChange: (mode: DashboardViewMode) => void
}

export function DashboardToolbar({
  period,
  onPeriodChange,
  viewMode,
  onViewModeChange,
}: DashboardToolbarProps) {
  return (
    <Card className="flex-row flex-wrap items-center justify-between gap-3 px-4">
      <div role="group" aria-label="Période" className="flex flex-wrap gap-2">
        {PERIODS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={period === item.value}
            onClick={() => onPeriodChange(item.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              period === item.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        role="group"
        aria-label="Affichage"
        className="flex rounded-full bg-muted p-1"
      >
        {VIEW_MODES.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={viewMode === item.value}
            onClick={() => onViewModeChange(item.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              viewMode === item.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </Card>
  )
}
