"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "cn"
import type { ReactNode } from "react"

import { formatPrice } from "@/shared/lib/format-price"
import { ChargeVersementHistoryDialog } from "@/features/charges/components/charge-versement-history-dialog"
import { CreateChargeVersementDialog } from "@/features/charges/components/create-charge-versement-dialog"
import { DeleteChargeDialog } from "@/features/charges/components/delete-charge-dialog"
import { EditChargeDialog } from "@/features/charges/components/edit-charge-dialog"
import { CHARGE_CATEGORIES } from "@/features/charges/constants/charge-categories"
import type { Charge } from "@/features/charges/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" })
const createdAtFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" })

const paymentStatusBadgeClasses: Record<Charge["payment_status_color"], string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

function PaymentStatusBadge({ charge }: { charge: Charge }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        paymentStatusBadgeClasses[charge.payment_status_color]
      )}
    >
      {charge.payment_status_label}
    </span>
  )
}

function ChargeActionsCell({ charge }: { charge: Charge }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {charge.payment_status === "unpaid" && (
        <>
          <EditChargeDialog charge={charge} />
          <DeleteChargeDialog charge={charge} />
        </>
      )}
      {charge.remaining_amount > 0 && <CreateChargeVersementDialog charge={charge} />}
      {charge.paid_amount > 0 && <ChargeVersementHistoryDialog charge={charge} />}
    </div>
  )
}

function CategoryIcon({ category }: { category: string }) {
  const definition = CHARGE_CATEGORIES.find((item) => item.key === category)
  if (!definition) return <span className="text-muted-foreground">—</span>

  const Icon = definition.icon

  return (
    <div
      className="mx-auto flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
      title={definition.label}
    >
      <Icon className="size-4" />
    </div>
  )
}

function ProductsCell({ charge }: { charge: Charge }) {
  if (charge.all_products) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        Tous
      </span>
    )
  }

  if (charge.product_names.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  return <span className="line-clamp-2">{charge.product_names.join(", ")}</span>
}

function formatDate(value: string | null): ReactNode {
  if (!value) return <span className="text-muted-foreground">—</span>
  return dateFormatter.format(new Date(value))
}

export const chargeColumns: ColumnDef<Charge>[] = [
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => <CategoryIcon category={row.original.category} />,
  },
  {
    accessorKey: "name",
    header: "Nom de la charge",
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => formatPrice(row.original.amount),
  },
  {
    accessorKey: "starts_at",
    header: "De",
    cell: ({ row }) => formatDate(row.original.starts_at),
  },
  {
    accessorKey: "ends_at",
    header: "À",
    cell: ({ row }) => formatDate(row.original.ends_at),
  },
  {
    id: "products",
    header: "Produit",
    cell: ({ row }) => <ProductsCell charge={row.original} />,
  },
  {
    accessorKey: "payment_status",
    header: "Statut de paiement",
    cell: ({ row }) => <PaymentStatusBadge charge={row.original} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ChargeActionsCell charge={row.original} />,
  },
]

export const recurringChargeColumns: ColumnDef<Charge>[] = [
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => <CategoryIcon category={row.original.category} />,
  },
  {
    id: "name",
    header: "Charges Récurrentes",
    cell: ({ row }) => {
      const charge = row.original
      const badgeLabel =
        charge.type === "recurring"
          ? `Facturation automatique ${formatPrice(charge.amount)} / ${charge.recurrence_frequency_label}`
          : `Par commande ${formatPrice(charge.amount)} / ${charge.order_trigger_label}`

      return (
        <div className="flex flex-col items-start gap-1">
          <span className="font-medium">{charge.name}</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            )}
          >
            {badgeLabel}
          </span>
        </div>
      )
    },
    meta: { align: "left" },
  },
  {
    id: "products",
    header: "Produit",
    cell: ({ row }) => <ProductsCell charge={row.original} />,
  },
  {
    accessorKey: "created_at",
    header: "Date de création",
    cell: ({ row }) => createdAtFormatter.format(new Date(row.original.created_at)),
  },
  {
    accessorKey: "payment_status",
    header: "Statut de paiement",
    cell: ({ row }) => <PaymentStatusBadge charge={row.original} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ChargeActionsCell charge={row.original} />,
  },
]
