"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ReviewBadge, RiskBadge } from "@/features/fraud/components/fraud-badges"
import type { FraudAssessment } from "@/features/fraud/types"

function Counts({ row }: { row: FraudAssessment }) {
  const c = row.counts
  const fmt = (v: number | null) => (v === null ? "–" : v)

  return (
    <span className="whitespace-nowrap text-xs tabular-nums">
      Emp. {fmt(c.fingerprint)} · Tél. {fmt(c.phone)} · IP {fmt(c.ip)} · Adr. {fmt(c.address)}
    </span>
  )
}

function Matches({ row }: { row: FraudAssessment }) {
  const entries = Object.entries(row.confirmed_fake_matches)
  if (entries.length === 0) return <>—</>

  return <span className="text-xs text-red-600 dark:text-red-400">{entries.map(([type]) => type).join(", ")}</span>
}

export function createFraudColumns(onOpen: (orderId: number) => void): ColumnDef<FraudAssessment>[] {
  return [
    { accessorKey: "order_reference", header: "Commande", meta: { className: "min-w-[110px]" } },
    {
      id: "phone",
      header: "Téléphone",
      cell: ({ row }) => row.original.customer_phone ?? "—",
      meta: { className: "min-w-[120px]" },
    },
    {
      id: "risk",
      header: "Risque",
      cell: ({ row }) => <RiskBadge level={row.original.risk_level} score={row.original.score} />,
    },
    {
      id: "counts",
      header: "Commandes aujourd'hui",
      cell: ({ row }) => <Counts row={row.original} />,
      meta: { className: "min-w-[240px]" },
    },
    {
      id: "device",
      header: "Navigateur / OS / Appareil",
      cell: ({ row }) =>
        [row.original.browser, row.original.os, row.original.device_category].filter(Boolean).join(" · ") || "—",
      meta: { className: "min-w-[220px]" },
    },
    {
      id: "ip",
      header: "IP",
      cell: ({ row }) => row.original.ip_address ?? "••••",
      meta: { className: "min-w-[110px]" },
    },
    { id: "matches", header: "Fausses confirmées liées", cell: ({ row }) => <Matches row={row.original} /> },
    {
      id: "status",
      header: "Statut commande",
      cell: ({ row }) => row.original.order_status_label ?? "—",
    },
    { id: "review", header: "Vérification", cell: ({ row }) => <ReviewBadge label={row.original.review.label} /> },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" aria-label="Détails" onClick={() => onOpen(row.original.order_id)}>
          <Info className="size-4" />
        </Button>
      ),
    },
  ]
}
