"use client"

import type * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DeleteOrderDialog } from "@/features/orders/components/delete-order-dialog"
import { EditOrderDialog } from "@/features/orders/components/edit-order-dialog"
import { FraudScoreCell } from "@/features/fraud/components/fraud-score-cell"
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

function Stacked({ primary, secondary }: { primary: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="truncate text-sm font-medium text-foreground">{primary}</span>
      {secondary ? <span className="truncate text-xs text-muted-foreground">{secondary}</span> : null}
    </div>
  )
}

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "reference",
    header: "Réf",
    cell: ({ row }) => <span className="text-sm font-medium tabular-nums">{row.original.reference}</span>,
    meta: { align: "left", className: "min-w-[130px]" },
  },
  {
    id: "client",
    header: "Client",
    cell: ({ row }) => (
      <Stacked primary={row.original.client_name || "—"} secondary={row.original.phone_number} />
    ),
    meta: { align: "left", className: "min-w-[170px]" },
  },
  {
    id: "product",
    header: "Produit",
    cell: ({ row }) => {
      const variant = itemsSummary(row.original, "variant")
      return (
        <Stacked
          primary={itemsSummary(row.original, "product_name")}
          secondary={variant !== "—" ? variant : undefined}
        />
      )
    },
    meta: { align: "left", className: "min-w-[180px] max-w-[240px]" },
  },
  {
    id: "location",
    header: "Destination",
    cell: ({ row }) => (
      <Stacked
        primary={[row.original.wilaya_name, row.original.commune_name].filter(Boolean).join(" · ") || "—"}
        secondary={
          row.original.delivery_type_label +
          (row.original.stop_desk_company_name ? ` — ${row.original.stop_desk_company_name}` : "")
        }
      />
    ),
    meta: { align: "left", className: "min-w-[180px]" },
  },
  {
    id: "total_price",
    header: "Total",
    cell: ({ row }) => (
      <span className="text-sm font-semibold whitespace-nowrap tabular-nums">
        {formatAmount(row.original.total_price)}
      </span>
    ),
    meta: { align: "right", className: "min-w-[120px]" },
  },
  {
    id: "fraud_risk",
    header: "Risque",
    cell: ({ row }) => <FraudScoreCell risk={row.original.fraud_risk} />,
    meta: { align: "left", className: "min-w-[140px]" },
  },
  {
    id: "elapsed",
    header: "Depuis",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap text-muted-foreground">
        <ElapsedTime since={row.original.status_changed_at} />
      </span>
    ),
    meta: { align: "left", className: "min-w-[100px]" },
  },
  {
    id: "status",
    header: "Statut",
    cell: ({ row }) => <OrderStatusCell order={row.original} />,
    meta: { align: "left", sticky: "right", stickyWidth: 180, className: "min-w-[180px]" },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        {row.original.is_editable && <EditOrderDialog order={row.original} />}
        {row.original.status === "assigned" && <ShipOrderDialog order={row.original} />}
        {row.original.can_delete &&<DeleteOrderDialog order={row.original} />}
        <OrderStatusHistoryDialog order={row.original} />
        <ViewOrderDialog order={row.original} />
      </div>
    ),
    meta: { sticky: "right", stickyWidth: 148, className: "min-w-[148px]" },
  },
]
