"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatPrice } from "@/shared/lib/format-price"
import { RateBadge } from "@/components/data-table/rate-badge"
import type { ProductAnalyticsItem, ProductAnalyticsMetric } from "@/features/product-analytics/types"

const quantityFormatter = new Intl.NumberFormat("fr-FR")

function MetricCell({ metric }: { metric: ProductAnalyticsMetric }) {
  return (
    <div className="flex flex-col items-center">
      <span>{quantityFormatter.format(metric.count)}</span>
      <span className="text-xs text-muted-foreground">({quantityFormatter.format(metric.quantity)})</span>
    </div>
  )
}

export const productAnalyticsColumns: ColumnDef<ProductAnalyticsItem>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) =>
      row.original.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.original.image}
          alt={row.original.name}
          className="mx-auto size-10 rounded-md object-cover"
        />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "name",
    header: "Nom du produit",
    meta: { align: "left" },
  },
  {
    id: "nombre_commandes",
    header: "Nombre de Commandes",
    cell: ({ row }) => <MetricCell metric={row.original.nombre_commandes} />,
  },
  {
    id: "confirme_sans_stock",
    header: "Commandes confirmées sans stock",
    cell: ({ row }) => <MetricCell metric={row.original.confirme_sans_stock} />,
  },
  {
    id: "commandes_confirmees",
    header: "Commandes Confirmées",
    cell: ({ row }) => <MetricCell metric={row.original.commandes_confirmees} />,
  },
  {
    id: "commandes_livrees",
    header: "Commandes Livrées",
    cell: ({ row }) => <MetricCell metric={row.original.commandes_livrees} />,
  },
  {
    id: "commandes_retournees",
    header: "Commandes Retournées",
    cell: ({ row }) => <MetricCell metric={row.original.commandes_retournees} />,
  },
  {
    accessorKey: "taux_confirmation",
    header: "Taux de Confirmation",
    cell: ({ row }) => <RateBadge value={row.original.taux_confirmation} />,
  },
  {
    accessorKey: "taux_livraison",
    header: "Taux de Livraison",
    cell: ({ row }) => <RateBadge value={row.original.taux_livraison} />,
  },
  {
    accessorKey: "performance_confirmation",
    header: "Performance de confirmation",
    cell: ({ row }) => <RateBadge value={row.original.performance_confirmation} />,
  },
  {
    accessorKey: "performance_livraison",
    header: "Performance de livraison",
    cell: ({ row }) => <RateBadge value={row.original.performance_livraison} />,
  },
  {
    accessorKey: "quantite_vendue",
    header: "Quantité Vendue",
    cell: ({ row }) => quantityFormatter.format(row.original.quantite_vendue),
  },
  {
    accessorKey: "ventes",
    header: "Ventes (DZD)",
    cell: ({ row }) => formatPrice(row.original.ventes),
  },
  {
    accessorKey: "cout_total_produit",
    header: "Coût Total du Produit (DZD)",
    cell: ({ row }) =>
      formatPrice(row.original.cout_total_produit) ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "marge_brute",
    header: "Marge brute (DZD)",
    cell: ({ row }) =>
      formatPrice(row.original.marge_brute) ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "profit_pourcentage",
    header: "Profit %",
    cell: ({ row }) => <RateBadge value={row.original.profit_pourcentage} />,
  },
  {
    accessorKey: "charge_totale",
    header: "Charge Totale (DZD)",
    cell: ({ row }) => formatPrice(row.original.charge_totale),
  },
  {
    id: "charge_par_piece",
    header: "Charge / Pièce (DZD)",
    cell: ({ row }) =>
      row.original.moyenne_par_piece
        ? formatPrice(row.original.moyenne_par_piece.charge)
        : <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "benefice_net",
    header: "Bénéfice Net (DZD)",
    cell: ({ row }) =>
      formatPrice(row.original.benefice_net) ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "benefice_net_par_piece",
    header: "Bénéfice Net / Pièce (DZD)",
    cell: ({ row }) =>
      row.original.moyenne_par_piece?.benefice_net != null
        ? formatPrice(row.original.moyenne_par_piece.benefice_net)
        : <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "profit_net_pourcentage",
    header: "Profit Net %",
    cell: ({ row }) => <RateBadge value={row.original.profit_net_pourcentage} />,
  },
]
