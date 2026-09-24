"use client"

import * as React from "react"
import { Landmark } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { CreateChargeDialog } from "@/features/charges/components/create-charge-dialog"
import { CHARGE_CATEGORIES, type ChargeCategoryDefinition } from "@/features/charges/constants/charge-categories"
import { useChargeStats } from "@/features/charges/hooks/use-charge-stats"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} (DZD)`
}

export function ChargesStatsCards() {
  const [selectedCategory, setSelectedCategory] = React.useState<ChargeCategoryDefinition | null>(null)
  const { data: stats } = useChargeStats()
  const chargeAmounts = stats?.by_category ?? {}
  const total = stats?.total ?? 0

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="ring-2 ring-primary">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Total des charges</span>
              <span className="text-xl font-semibold">{formatAmount(total)}</span>
            </div>
          </CardContent>
        </Card>

        {CHARGE_CATEGORIES.map((category) => {
          const { key, label, icon: Icon } = category

          return (
            <Card
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCategory(category)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  setSelectedCategory(category)
                }
              }}
              className={cn(
                "cursor-pointer transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              <CardContent className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
                  <span className="text-xl font-semibold">{formatAmount(chargeAmounts[key] ?? 0)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedCategory && (
        <CreateChargeDialog
          category={selectedCategory}
          open
          onOpenChange={(open) => {
            if (!open) setSelectedCategory(null)
          }}
        />
      )}
    </>
  )
}
