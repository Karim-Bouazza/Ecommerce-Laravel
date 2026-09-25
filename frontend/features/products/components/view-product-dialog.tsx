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
import { cn } from "cn"
import { formatPrice } from "@/shared/lib/format-price"
import type { Product } from "@/features/products/types"

type ViewProductDialogProps = {
  product: Product
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function ViewProductDialog({ product }: ViewProductDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voir les détails"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails du produit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-center gap-4">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="size-20 rounded-md border object-cover"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-md border text-xs text-muted-foreground">
                Aucune image
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="font-heading text-base font-semibold">{product.name}</span>
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  product.is_active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {product.is_active ? "Actif" : "Inactif"}
              </span>
              {product.is_new && (
                <span className="inline-flex w-fit items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Nouveau
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField
              label="Catégorie"
              value={product.category ?? <span className="text-muted-foreground">—</span>}
            />
            <DetailField
              label="Marque"
              value={product.brand ?? <span className="text-muted-foreground">—</span>}
            />
            <DetailField
              label="SKU"
              value={product.sku ?? <span className="text-muted-foreground">—</span>}
            />
            <DetailField label="Stock total" value={product.total_stock} />
            <DetailField
              label="Prix d'achat"
              value={formatPrice(product.purchase_price) ?? <span className="text-muted-foreground">—</span>}
            />
            <DetailField
              label="Prix de vente"
              value={formatPrice(product.price) ?? <span className="text-muted-foreground">—</span>}
            />
          </div>

          {product.tags.length > 0 && (
            <DetailField
              label="Étiquettes"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              }
            />
          )}

          {product.specs.length > 0 && (
            <DetailField
              label="Caractéristiques"
              value={
                <div className="grid gap-1 sm:grid-cols-2">
                  {product.specs.map((spec) => (
                    <div key={spec.id} className="flex justify-between gap-2 text-sm">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {product.variants.length > 0 && (
            <DetailField
              label="Variantes"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {product.variants.map((variant) => (
                    <span
                      key={variant.id}
                      className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {variant.label}
                    </span>
                  ))}
                </div>
              }
            />
          )}

          {product.short_description && (
            <DetailField label="Description courte" value={product.short_description} />
          )}

          <DetailField label="Description" value={product.description} />
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
