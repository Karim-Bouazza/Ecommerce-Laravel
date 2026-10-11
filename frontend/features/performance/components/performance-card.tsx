import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "cn"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const tones = {
  emerald: {
    header: "bg-emerald-500/10",
    tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-700 dark:text-emerald-400",
  },
  orange: {
    header: "bg-orange-500/10",
    tile: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    title: "text-orange-700 dark:text-orange-400",
  },
  indigo: {
    header: "bg-indigo-500/10",
    tile: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    title: "text-indigo-700 dark:text-indigo-400",
  },
  violet: {
    header: "bg-violet-500/10",
    tile: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    title: "text-violet-700 dark:text-violet-400",
  },
  sky: {
    header: "bg-sky-500/10",
    tile: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    title: "text-sky-700 dark:text-sky-400",
  },
} as const

export type PerformanceCardTone = keyof typeof tones

type PerformanceCardProps = {
  title: string
  icon: LucideIcon
  tone: PerformanceCardTone
  busy?: boolean
  children: ReactNode
}

export function PerformanceCard({ title, icon: Icon, tone, busy, children }: PerformanceCardProps) {
  const styles = tones[tone]

  return (
    <Card className="h-full p-0" aria-busy={busy}>
      <CardHeader className={cn("flex-row items-center gap-3 rounded-t-xl px-4 py-4", styles.header)}>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", styles.tile)}>
          <Icon className="size-5" aria-hidden />
        </div>
        <CardTitle className={styles.title}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 pb-4">{children}</CardContent>
    </Card>
  )
}

type MetricRowProps = {
  label: string
  value: ReactNode
  loading?: boolean
  negative?: boolean
  badge?: ReactNode
}

/** Loading shows a fixed-size skeleton so the row height never jumps. */
export function MetricRow({ label, value, loading, negative, badge }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        {loading ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <>
            <span
              className={cn(
                "text-base font-semibold tabular-nums",
                negative && "text-destructive"
              )}
            >
              {value}
            </span>
            {badge}
          </>
        )}
      </span>
    </div>
  )
}

export function ComingSoonRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        Bientôt
      </span>
    </div>
  )
}
