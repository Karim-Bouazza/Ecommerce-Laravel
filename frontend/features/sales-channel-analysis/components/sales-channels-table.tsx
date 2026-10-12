"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table/data-table"
import { RateBadge } from "@/components/data-table/rate-badge"
import { formatPrice } from "@/shared/lib/format-price"
import type { SalesChannel } from "@/features/sales-channel-analysis/types"

const countFormatter = new Intl.NumberFormat("fr-FR")

const columns: ColumnDef<SalesChannel>[] = [
  { accessorKey: "kind", header: "Type" },
  { accessorKey: "name", header: "Nom", meta: { align: "left", className: "font-medium" } },
  {
    accessorKey: "orders",
    header: "Nombre de Commandes",
    cell: ({ row }) => countFormatter.format(row.original.orders),
  },
  {
    accessorKey: "confirmed",
    header: "Commandes Confirmées",
    cell: ({ row }) => countFormatter.format(row.original.confirmed),
  },
  {
    accessorKey: "delivered",
    header: "Commandes Livrées",
    cell: ({ row }) => countFormatter.format(row.original.delivered),
  },
  {
    accessorKey: "returned",
    header: "Commandes Retournées",
    cell: ({ row }) => countFormatter.format(row.original.returned),
  },
  {
    accessorKey: "confirmation_rate",
    header: "Taux de Confirmation",
    cell: ({ row }) => <RateBadge value={row.original.confirmation_rate} />,
  },
  {
    accessorKey: "delivery_rate",
    header: "Taux de Livraison",
    cell: ({ row }) => <RateBadge value={row.original.delivery_rate} />,
  },
  {
    accessorKey: "delivery_performance",
    header: "Performance de livraison",
    cell: ({ row }) => <RateBadge value={row.original.delivery_performance} />,
  },
  {
    accessorKey: "sales",
    header: "Ventes (DZD)",
    cell: ({ row }) => formatPrice(row.original.sales),
  },
]

export function SalesChannelsTable({
  data,
  isLoading,
}: {
  data: SalesChannel[] | undefined
  isLoading: boolean
}) {
  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      isLoading={isLoading}
      emptyMessage="Aucun canal de vente trouvé."
    />
  )
}
