"use client"

import * as React from "react"
import {
  Headset,
  Map,
  Megaphone,
  PhoneCall,
  Truck,
  UserCheck,
  Users,
} from "lucide-react"

import { DashboardFiltersSheet, type DashboardFiltersValue } from "@/features/dashboard/components/dashboard-filters-sheet"
import { DashboardStatCards } from "@/features/dashboard/components/dashboard-stat-cards"
import {
  DashboardToolbar,
  type DashboardPeriodSelection,
  type DashboardViewMode,
} from "@/features/dashboard/components/dashboard-toolbar"
import { ComingSoonWidget } from "@/features/dashboard/components/dashboard-widget"
import { TopProductsWidget } from "@/features/dashboard/components/top-products-widget"
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard"
import { Card } from "@/components/ui/card"
import type { DashboardPeriod } from "@/features/dashboard/types"

export function DashboardPage() {
  const [period, setPeriod] = React.useState<DashboardPeriod>("all_time")
  const [filters, setFilters] = React.useState<DashboardFiltersValue>({})
  const [viewMode, setViewMode] = React.useState<DashboardViewMode>("numbers")

  const hasCustomDates = Boolean(filters.date_from || filters.date_to)
  const selection: DashboardPeriodSelection = hasCustomDates ? "custom" : period

  const { data } = useDashboard({
    ...filters,
    period: hasCustomDates ? undefined : period,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-semibold">Tableau de bord</h1>
        <DashboardFiltersSheet value={filters} onApply={setFilters} />
      </div>

      <DashboardToolbar
        period={selection}
        onPeriodChange={(next) => {
          setPeriod(next)
          setFilters((current) => ({ ...current, date_from: undefined, date_to: undefined }))
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DashboardStatCards stats={data?.stats} viewMode={viewMode} />

      <Card className="flex-row items-center gap-4 px-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <UserCheck className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Statut des agents en ligne
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">Bientôt</span>
          </p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <TopProductsWidget products={data?.top_products} className="lg:col-span-2" />
        <ComingSoonWidget title="Meilleure Wilaya" icon={Map} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ComingSoonWidget title="Meilleures entreprises de livraison" icon={Truck} />
        <ComingSoonWidget title="Meilleurs clients" icon={Users} />
        <ComingSoonWidget title="Meilleurs agents" icon={Headset} />
        <ComingSoonWidget title="Meilleurs agents de suivi" icon={PhoneCall} />
        <ComingSoonWidget title="Meilleurs Marketers" icon={Megaphone} />
      </div>
    </div>
  )
}
