"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Order } from "@/features/orders/types"

type ViewOrderDialogProps = {
  order: Order
}

const amountFormatter = new Intl.NumberFormat("fr-FR")

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} DZD`
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function ViewOrderDialog({ order }: ViewOrderDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Détails"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la commande — {order.reference}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Nom de la commande" value={order.name || "—"} />
            <DetailField
              label="N° de commande prestataire"
              value={order.provider_order_id || "—"}
            />
            <DetailField label="Client" value={order.client_name || "—"} />
            <DetailField label="Téléphone" value={order.phone_number || "—"} />
            <DetailField
              label="Wilaya / Commune"
              value={[order.wilaya_name, order.commune_name].filter(Boolean).join(" / ") || "—"}
            />
            <DetailField label="Adresse" value={order.address || "—"} />
            <DetailField label="Statut" value={order.status_label} />
            {order.date_report && (
              <DetailField
                label="Date de report"
                value={new Date(order.date_report).toLocaleDateString("fr-FR")}
              />
            )}
            <DetailField label="Paiement" value={order.payment_status_label} />
            <DetailField
              label="Livraison"
              value={
                order.delivery_type_label +
                (order.stop_desk_company_name ? ` — ${order.stop_desk_company_name}` : "")
              }
            />
            <DetailField label="Note pour le livreur" value={order.delivery_note || "—"} />
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Variante</TableHead>
                  <TableHead>Entrepôt</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Aucun produit.
                    </TableCell>
                  </TableRow>
                ) : (
                  order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name ?? "—"}</TableCell>
                      <TableCell>{item.variant || "—"}</TableCell>
                      <TableCell>{item.warehouse_name ?? "—"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatAmount(item.price)}</TableCell>
                      <TableCell>{formatAmount(item.total_price)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-end gap-1 border-t pt-3 text-sm">
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{formatAmount(order.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Frais de livraison</span>
              <span>{formatAmount(order.delivery_price)}</span>
            </div>
            <div className="flex justify-between gap-8 font-semibold">
              <span>Total</span>
              <span>{formatAmount(order.total_price)}</span>
            </div>
          </div>
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
