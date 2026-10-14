import { Badge } from "@/components/ui/badge"
import type { ReviewLabel, RiskLevel } from "@/features/fraud/types"

const RISK_STYLES: Record<RiskLevel, string> = {
  LOW: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  MEDIUM: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
}

const RISK_LABELS: Record<RiskLevel, string> = {
  LOW: "Faible",
  MEDIUM: "Moyen",
  HIGH: "Élevé",
  CRITICAL: "Critique",
}

export const REVIEW_LABELS: Record<ReviewLabel, string> = {
  UNKNOWN: "Non vérifiée",
  LEGITIMATE: "Légitime",
  CONFIRMED_FAKE: "Fausse confirmée",
}

const REVIEW_STYLES: Record<ReviewLabel, string> = {
  UNKNOWN: "bg-muted text-muted-foreground",
  LEGITIMATE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  CONFIRMED_FAKE: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
}

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  return (
    <Badge variant="outline" className={`border-transparent ${RISK_STYLES[level]}`}>
      {score !== undefined ? `${score} · ` : ""}
      {RISK_LABELS[level]}
    </Badge>
  )
}

export function ReviewBadge({ label }: { label: ReviewLabel }) {
  return (
    <Badge variant="outline" className={`border-transparent ${REVIEW_STYLES[label]}`}>
      {REVIEW_LABELS[label]}
    </Badge>
  )
}
