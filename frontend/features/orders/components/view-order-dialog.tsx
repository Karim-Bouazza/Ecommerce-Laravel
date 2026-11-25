"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { statusBadgeClasses } from "@/features/orders/components/order-status-cell";
import { useOrder } from "@/features/orders/hooks/use-order";
import type { Order } from "@/features/orders/types";

type ViewOrderDialogProps = {
  order: Order;
};

const amountFormatter = new Intl.NumberFormat("fr-FR");

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatAmount(value: number): string {
  return `${amountFormatter.format(value)} DZD`;
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function ViewOrderDialog({ order }: ViewOrderDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { data: details, isPending, isError } = useOrder(order.id, open);

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

        {isPending ? (
          <DetailsSkeleton />
        ) : isError || !details ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Impossible de charger la commande.
          </p>
        ) : (
          <ScrollArea className="max-h-[65vh]">
            <div className="flex flex-col gap-4 py-2 pr-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField
                  label="Statut"
                  value={
                    <Badge
                      className={cn(
                        "h-auto px-2.5",
                        statusBadgeClasses[details.status_color]
                      )}
                    >
                      {details.status}
                    </Badge>
                  }
                />
                <DetailField
                  label="Nom de la commande"
                  value={details.name || "—"}
                />
                <DetailField
                  label="Adresse IP"
                  value={details.ip_address || "—"}
                />
                <DetailField
                  label="N° de commande prestataire"
                  value={details.provider_order_id || "—"}
                />
                <DetailField
                  label="Client"
                  value={
                    [details.first_name, details.last_name]
                      .filter(Boolean)
                      .join(" ") || "—"
                  }
                />
                <DetailField
                  label="Téléphone"
                  value={details.phone_number || "—"}
                />
                <DetailField
                  label="Wilaya / Commune"
                  value={
                    [details.wilaya_name, details.commune_name]
                      .filter(Boolean)
                      .join(" / ") || "—"
                  }
                />
                <DetailField label="Adresse" value={details.address || "—"} />
                <DetailField label="Paiement" value={details.payment_status} />
                <DetailField label="Type" value={details.type} />
                <DetailField
                  label="Livraison"
                  value={
                    details.delivery_type +
                    (details.stop_desk_company_name
                      ? ` — ${details.stop_desk_company_name}`
                      : "")
                  }
                />
                <DetailField
                  label="Livraison gratuite"
                  value={details.free_delivery ? "Oui" : "Non"}
                />
                <DetailField
                  label="Ouverture du colis"
                  value={details.can_be_opened ? "Autorisée" : "Non autorisée"}
                />
                <DetailField
                  label="Créée le"
                  value={dateFormatter.format(new Date(details.created_at))}
                />
                {details.date_report && (
                  <DetailField
                    label="Date de report"
                    value={new Date(details.date_report).toLocaleDateString(
                      "fr-FR"
                    )}
                  />
                )}
                <DetailField
                  label="Note pour le livreur"
                  value={details.delivery_note || "—"}
                />
              </div>

              <Separator />

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
                    {details.items.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          Aucun produit.
                        </TableCell>
                      </TableRow>
                    ) : (
                      details.items.map((item) => (
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

              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatAmount(details.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">
                    Frais de livraison
                  </span>
                  <span>{formatAmount(details.delivery_price)}</span>
                </div>
                <div className="flex justify-between gap-8 font-semibold">
                  <span>Total</span>
                  <span>{formatAmount(details.total_price)}</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
