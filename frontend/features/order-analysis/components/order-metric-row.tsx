import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "cn"

import { Skeleton } from "@/components/ui/skeleton"

const tones = {
  gray: "bg-muted text-muted-foreground",
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  red: "bg-destructive/10 text-destructive",
  indigo: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
} as const

export type OrderMetricTone = keyof typeof tones

type OrderMetricRowProps = {
  label: string
  icon: LucideIcon
  tone: OrderMetricTone
  value: ReactNode
  loading?: boolean
  badge?: ReactNode
}

/** Loading shows a fixed-size skeleton so the row height never jumps. */
export function OrderMetricRow({ label, icon: Icon, tone, value, loading, badge }: OrderMetricRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 px-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="size-4" aria-hidden />
        </div>
        <span className="text-sm font-medium tracking-wide text-foreground/90 uppercase">{label}</span>
      </div>
      <span className="flex shrink-0 items-center gap-2">
        {loading ? (
          <Skeleton className="h-6 w-12" />
        ) : (
          <>
            <span className="text-base font-semibold tabular-nums">{value}</span>
            {badge}
          </>
        )}
      </span>
    </div>
  )
}
