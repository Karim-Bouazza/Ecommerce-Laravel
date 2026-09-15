"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DeleteOrderDialog } from "@/features/orders/components/delete-order-dialog"
import { EditOrderDialog } from "@/features/orders/components/edit-order-dialog"
import { ElapsedTime } from "@/features/orders/components/elapsed-time"
import { OrderStatusCell } from "@/features/orders/components/order-status-cell"
import { OrderStatusHistoryDialog } from "@/features/orders/components/order-status-history-dialog"
import { ShipOrderDialog } from "@/features/orders/components/ship-order-dialog"
import { ViewOrderDialog } from "@/features/orders/components/view-order-dialog"
import type { Order } from "@/features/orders/types"

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} DZD`
}

function itemsSummary(order: Order, key: "product_name" | "variant"): string {
  const values = order.items.map((item) => item[key]).filter((value): value is string => Boolean(value))
  return values.length > 0 ? values.join(", ") : "—"
}

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "reference",
    header: "Réf",
    meta: { className: "min-w-[110px]" },
  },
  {
    id: "client",
    header: "Client",
    cell: ({ row }) => row.original.client_name || "—",
    meta: { className: "min-w-[140px]" },
  },
  {
    accessorKey: "phone_number",
    header: "Téléphone",
    cell: ({ row }) => row.original.phone_number ?? "—",
    meta: { className: "min-w-[130px]" },
  },
  {
    id: "location",
    header: "Wilaya / Commune",
    cell: ({ row }) => [row.original.wilaya_name, row.original.commune_name].filter(Boolean).join(" / ") || "—",
    meta: { className: "min-w-[160px]" },
  },
  {
    id: "product",
    header: "Produit",
    cell: ({ row }) => itemsSummary(row.original, "product_name"),
    meta: { className: "min-w-[160px]" },
  },
  {
    id: "variant",
    header: "Variante",
    cell: ({ row }) => itemsSummary(row.original, "variant"),
    meta: { className: "min-w-[130px]" },
  },
  {
    id: "total_price",
    header: "Total",
    cell: ({ row }) => formatAmount(row.original.total_price),
    meta: { className: "min-w-[110px]" },
  },
  {
    id: "delivery",
    header: "Livraison",
    cell: ({ row }) =>
      row.original.delivery_type_label +
      (row.original.stop_desk_company_name ? ` — ${row.original.stop_desk_company_name}` : ""),
    meta: { className: "min-w-[150px]" },
  },
  {
    id: "elapsed",
    header: "Temps écoulé",
    cell: ({ row }) => <ElapsedTime since={row.original.status_changed_at} />,
    meta: { sticky: "right", stickyWidth: 110, className: "min-w-[110px]" },
  },
  {
    id: "status",
    header: "Statut de confirmation",
    cell: ({ row }) => <OrderStatusCell order={row.original} />,
    meta: { sticky: "right", stickyWidth: 160, className: "min-w-[160px]" },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        {row.original.is_editable && <EditOrderDialog order={row.original} />}
        {row.original.status === "assigned" && <ShipOrderDialog order={row.original} />}
        {row.original.status === "pending" && <DeleteOrderDialog order={row.original} />}
        <OrderStatusHistoryDialog order={row.original} />
        <ViewOrderDialog order={row.original} />
      </div>
    ),
    meta: { sticky: "right", stickyWidth: 144, className: "min-w-[144px]" },
  },
]
