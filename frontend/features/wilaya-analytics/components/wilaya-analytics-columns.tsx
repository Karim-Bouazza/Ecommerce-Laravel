"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { RateBadge } from "@/components/data-table/rate-badge"
import type { WilayaAnalyticsItem, WilayaAnalyticsMetric } from "@/features/wilaya-analytics/types"

export type WilayaAnalyticsDisplayMode = "count" | "percentage"

const quantityFormatter = new Intl.NumberFormat("fr-FR")

function VolumeCell({ metric, mode }: { metric: WilayaAnalyticsMetric; mode: WilayaAnalyticsDisplayMode }) {
  return mode === "count" ? (
    <span>{quantityFormatter.format(metric.count)}</span>
  ) : (
    <RateBadge value={metric.percentage} />
  )
}

export function getWilayaAnalyticsColumns(mode: WilayaAnalyticsDisplayMode): ColumnDef<WilayaAnalyticsItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Nom",
      meta: { align: "left" },
    },
    {
      id: "nombre_commandes",
      header: "Nombre de Commandes",
      cell: ({ row }) => <VolumeCell metric={row.original.nombre_commandes} mode={mode} />,
    },
    {
      id: "commandes_confirmees",
      header: "Commandes Confirmées",
      cell: ({ row }) => <VolumeCell metric={row.original.commandes_confirmees} mode={mode} />,
    },
    {
      id: "commandes_livrees",
      header: "Commandes Livrées",
      cell: ({ row }) => <VolumeCell metric={row.original.commandes_livrees} mode={mode} />,
    },
    {
      id: "commandes_retournees",
      header: "Commandes Retournées",
      cell: ({ row }) => <VolumeCell metric={row.original.commandes_retournees} mode={mode} />,
    },
    {
      accessorKey: "taux_confirmation",
      header: "Taux de Confirmation",
      cell: ({ row }) => <RateBadge value={row.original.taux_confirmation} />,
    },
    {
      accessorKey: "performance_confirmation",
      header: "Performance de confirmation",
      cell: ({ row }) => <RateBadge value={row.original.performance_confirmation} />,
    },
    {
      accessorKey: "taux_livraison",
      header: "Taux de Livraison",
      cell: ({ row }) => <RateBadge value={row.original.taux_livraison} />,
    },
    {
      accessorKey: "performance_livraison",
      header: "Performance de livraison",
      cell: ({ row }) => <RateBadge value={row.original.performance_livraison} />,
    },
  ]
}
