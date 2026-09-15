"use client"

import * as React from "react"
import { History } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { statusBadgeClasses } from "@/features/orders/components/order-status-cell"
import { useOrderStatusHistory } from "@/features/orders/hooks/use-order-status-history"
import type { Order } from "@/features/orders/types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "medium",
})

type OrderStatusHistoryDialogProps = {
  order: Order
}

export function OrderStatusHistoryDialog({ order }: OrderStatusHistoryDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { data: histories = [], isPending } = useOrderStatusHistory(order.id, open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Historique de la commande"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <History className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Historique — {order.reference}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto py-2 pr-1">
          {isPending ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Chargement…</p>
          ) : histories.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucun historique.</p>
          ) : (
            <ol>
              {histories.map((entry, index) => {
                const isCurrent = index === histories.length - 1

                return (
                  <li key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "mt-1.5 size-3 shrink-0 rounded-full",
                          isCurrent ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/40"
                        )}
                      />
                      {!isCurrent && <span className="w-px flex-1 bg-border" />}
                    </div>

                    <div
                      className={cn(
                        "mb-4 flex-1 rounded-lg border p-3",
                        isCurrent && "border-primary/50 bg-primary/5 shadow-sm"
                      )}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {entry.user_name ?? "Système"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {dateFormatter.format(new Date(entry.created_at))}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {entry.previous_status_label && entry.previous_status_color && (
                          <>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                statusBadgeClasses[entry.previous_status_color]
                              )}
                            >
                              {entry.previous_status_label}
                            </span>
                            <span className="text-xs text-muted-foreground">→</span>
                          </>
                        )}
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            statusBadgeClasses[entry.status_color]
                          )}
                        >
                          {entry.status_label}
                        </span>
                      </div>

                      {isCurrent && (
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
                          Statut actuel
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
