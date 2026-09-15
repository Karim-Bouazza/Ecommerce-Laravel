"use client"

import { ArrowDownToLine, ArrowUpFromLine, Wallet } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { useWalletStats } from "@/features/wallets/hooks/use-wallet-stats"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number | undefined): string {
  if (value === undefined) return "—"
  return `${amountFormatter.format(value)} (DZD)`
}

const stats = [
  {
    key: "balance" as const,
    label: "SOLDE",
    icon: Wallet,
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    key: "entries" as const,
    label: "ENTRÉE",
    icon: ArrowDownToLine,
    iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "exits" as const,
    label: "SORTIE",
    icon: ArrowUpFromLine,
    iconClassName: "bg-destructive/10 text-destructive",
  },
]

export function WalletStatsCards() {
  const { data, isPending } = useWalletStats()

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ key, label, icon: Icon, iconClassName }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4">
            <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", iconClassName)}>
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</span>
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
