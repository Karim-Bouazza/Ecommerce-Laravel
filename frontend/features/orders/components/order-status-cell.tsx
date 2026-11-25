"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReportOrderDialog } from "@/features/orders/components/report-order-dialog"
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status"
import type { BadgeColor, Order } from "@/features/orders/types"

const REPORTED_STATUS = "reported"
const CURRENT_STATUS = "__current__"

export const statusBadgeClasses: Record<BadgeColor, string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  gray: "bg-muted text-muted-foreground",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  primary: "bg-primary/10 text-primary",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
}

type OrderStatusCellProps = {
  order: Order
}

export function OrderStatusCell({ order }: OrderStatusCellProps) {
  const mutation = useUpdateOrderStatus()
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false)

  if (order.status_transitions.length === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          statusBadgeClasses[order.status_color]
        )}
      >
        {order.status}
      </span>
    )
  }

  return (
    <>
      <Select
        value={CURRENT_STATUS}
        disabled={mutation.isPending}
        onValueChange={(value) => {
          if (value === CURRENT_STATUS) return
          if (value === REPORTED_STATUS) {
            setReportDialogOpen(true)
            return
          }
          mutation.mutate({ id: order.id, status: value as string })
        }}
      >
        <SelectTrigger
          className={cn(
            "h-auto w-fit rounded-full border-none px-2.5 py-0.5 text-xs font-medium",
            statusBadgeClasses[order.status_color]
          )}
        >
          <SelectValue>{order.status}</SelectValue>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value={CURRENT_STATUS}>{order.status}</SelectItem>
          {order.status_transitions.map((transition) => (
            <SelectItem key={transition.value} value={transition.value}>
              {transition.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ReportOrderDialog order={order} open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
    </>
  )
}
