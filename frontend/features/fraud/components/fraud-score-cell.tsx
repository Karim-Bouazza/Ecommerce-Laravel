import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"

import { REVIEW_LABELS } from "@/features/fraud/components/fraud-badges"
import type { OrderFraudRisk } from "@/features/orders/types"

const LEVELS = {
  LOW: { label: "Faible", text: "text-emerald-700 dark:text-emerald-400", bar: "bg-emerald-500", Icon: ShieldCheck },
  MEDIUM: { label: "Moyen", text: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500", Icon: ShieldQuestion },
  HIGH: { label: "Élevé", text: "text-orange-700 dark:text-orange-400", bar: "bg-orange-500", Icon: ShieldAlert },
  CRITICAL: { label: "Critique", text: "text-red-700 dark:text-red-400", bar: "bg-red-600", Icon: ShieldAlert },
} as const

/** Compact risk indicator for the orders table: icon + score + level, with a 0–100 meter. */
export function FraudScoreCell({ risk }: { risk: OrderFraudRisk | null }) {
  if (!risk) return <span className="text-muted-foreground">—</span>

  const { label, text, bar, Icon } = LEVELS[risk.level]
  const review = risk.review_label !== "UNKNOWN" ? ` · ${REVIEW_LABELS[risk.review_label]}` : ""
  const description = `Risque ${label.toLowerCase()} : ${risk.score}/100${review}`

  return (
    <div className="flex flex-col gap-1" title={description} aria-label={description} role="img">
      <div className={`flex items-center gap-1.5 text-sm font-medium ${text}`}>
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">{risk.score}</span>
        <span className="text-xs font-normal">{label}</span>
      </div>
      <div className="h-1.5 w-full max-w-24 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.max(risk.score, 4)}%` }} />
      </div>
      {risk.review_label !== "UNKNOWN" && (
        <span className="text-[11px] text-muted-foreground">{REVIEW_LABELS[risk.review_label]}</span>
      )}
    </div>
  )
}
