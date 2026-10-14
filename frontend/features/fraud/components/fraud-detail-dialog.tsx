"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { REVIEW_LABELS, ReviewBadge, RiskBadge } from "@/features/fraud/components/fraud-badges"
import { useFraudAssessment, useReviewFraudOrder } from "@/features/fraud/hooks/use-fraud"
import type { FraudAssessmentDetail, ReviewLabel } from "@/features/fraud/types"
import { useAbility } from "@/features/auth/lib/ability-provider"

const IDENTIFIER_LABELS = {
  fingerprint: "Empreinte navigateur",
  phone: "Téléphone",
  ip: "Adresse IP",
  address: "Adresse de livraison",
} as const

const COMPONENT_LABELS = { daily: "Activité du jour", historical: "Historique", outcome: "Résultats", excluded_ip: "IP exclue" } as const

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function ReviewForm({ detail }: { detail: FraudAssessmentDetail }) {
  const [reason, setReason] = React.useState("")
  const mutation = useReviewFraudOrder(detail.order_id)

  function submit(label: ReviewLabel) {
    mutation.mutate({ label, reason: reason.trim() || undefined }, { onSuccess: () => setReason("") })
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Décision actuelle :</span>
        <ReviewBadge label={detail.review.label} />
        {detail.review.reviewed_by && (
          <span className="text-xs text-muted-foreground">
            par {detail.review.reviewed_by}
            {detail.review.reviewed_at && ` le ${new Date(detail.review.reviewed_at).toLocaleString("fr-FR")}`}
          </span>
        )}
      </div>
      {detail.review.reason && <p className="text-sm">« {detail.review.reason} »</p>}
      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motif (obligatoire pour Légitime / Fausse confirmée)"
        maxLength={1000}
      />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={mutation.isPending || !reason.trim()} onClick={() => submit("LEGITIMATE")}>
          {REVIEW_LABELS.LEGITIMATE}
        </Button>
        <Button size="sm" variant="destructive" disabled={mutation.isPending || !reason.trim()} onClick={() => submit("CONFIRMED_FAKE")}>
          {REVIEW_LABELS.CONFIRMED_FAKE}
        </Button>
        <Button size="sm" variant="ghost" disabled={mutation.isPending} onClick={() => submit("UNKNOWN")}>
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}

function Detail({ detail }: { detail: FraudAssessmentDetail }) {
  const ability = useAbility()
  const canReview = ability.can("review", "fraud")

  return (
    <div className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto pr-1 text-sm">
      <div className="flex items-center gap-2">
        <RiskBadge level={detail.risk_level} score={detail.score} />
        <span className="text-muted-foreground">
          {detail.customer_name} · {detail.customer_phone} · {detail.order_status_label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Activité du jour (max 40)" value={detail.daily_points} />
        <Stat label="Historique (max 60)" value={detail.historical_points} />
        <Stat label="Résultats (max 10)" value={detail.outcome_points} />
        <Stat label="IP exclue (max 20)" value={detail.excluded_ip_points} />
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="font-medium">Règles déclenchées</h3>
        {detail.reasons.length === 0 && <p className="text-muted-foreground">Aucune règle déclenchée.</p>}
        {detail.reasons.map((r) => (
          <div key={r.rule} className="rounded-md border p-2">
            <div className="flex justify-between">
              <span className="font-medium">
                {COMPONENT_LABELS[r.component]} · {IDENTIFIER_LABELS[r.identifier]}
              </span>
              <span className="tabular-nums">+{r.points}</span>
            </div>
            <p className="text-muted-foreground">{r.explanation}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {r.rule} {JSON.stringify(r.evidence)}
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-1">
        <h3 className="font-medium">Appareil</h3>
        <p className="text-muted-foreground">
          {[detail.browser, detail.os, detail.device_category].filter(Boolean).join(" · ") || "—"}
          {detail.ip_address && ` · IP ${detail.ip_address}`}
          {!detail.has_fingerprint && " · empreinte indisponible"}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-medium">Commandes liées</h3>
        {detail.related_orders.length === 0 && <p className="text-muted-foreground">Aucune.</p>}
        {detail.related_orders.map((o) => (
          <div key={o.order_id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2">
            <span>
              {o.reference} · {o.status_label}
            </span>
            <span className="text-xs text-muted-foreground">
              {o.shared.map((s) => IDENTIFIER_LABELS[s]).join(", ")}
            </span>
            <ReviewBadge label={o.review_label} />
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-1">
        <h3 className="font-medium">Historique du score</h3>
        {detail.history.map((h, i) => (
          <p key={i} className="text-muted-foreground">
            {h.created_at && new Date(h.created_at).toLocaleString("fr-FR")} — {h.old_score ?? "·"} → {h.new_score} (
            {h.trigger})
          </p>
        ))}
      </section>

      {canReview && <ReviewForm detail={detail} />}
    </div>
  )
}

export function FraudDetailDialog({ orderId, onClose }: { orderId: number | null; onClose: () => void }) {
  const { data, isPending } = useFraudAssessment(orderId)

  return (
    <Dialog open={orderId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Évaluation de fraude — {data?.order_reference ?? ""}</DialogTitle>
        </DialogHeader>
        {isPending || !data ? <Skeleton className="h-64 w-full" /> : <Detail detail={data} />}
      </DialogContent>
    </Dialog>
  )
}
