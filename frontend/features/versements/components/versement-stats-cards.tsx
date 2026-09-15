"use client"

import { CheckCircle2, Clock, Users } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { useVersementStats } from "@/features/versements/hooks/use-versement-stats"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number | undefined): string {
  if (value === undefined) return "—"
  return `${amountFormatter.format(value)} (DZD)`
}

const stats = [
  {
    key: "total_dues" as const,
    label: "TOTAL DES DUES",
    icon: Users,
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    key: "total_paid" as const,
    label: "MONTANT PAYÉ",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "total_remaining" as const,
    label: "MONTANT RESTANT",
    icon: Clock,
    iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
]

export function VersementStatsCards() {
  const { data, isPending } = useVersementStats()

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ key, label, icon: Icon, iconClassName }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-lg",
                iconClassName
              )}
            >
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                {label}
              </span>
              <span className="text-xl font-semibold">
                {isPending ? "…" : formatAmount(data?.[key])}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
