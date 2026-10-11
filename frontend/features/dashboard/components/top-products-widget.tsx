"use client"

import { Package, Trophy } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { DashboardWidget } from "@/features/dashboard/components/dashboard-widget"
import type { DashboardTopProduct } from "@/features/dashboard/types"
import { formatPrice } from "@/shared/lib/format-price"

export function TopProductsWidget({
  products,
  className,
}: {
  products: DashboardTopProduct[] | undefined
  className?: string
}) {
  const maxQuantity = Math.max(...(products ?? []).map((product) => product.quantity), 1)

  return (
    <DashboardWidget title="Meilleurs produits" icon={Trophy} className={className}>
      {products === undefined ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
          Aucune donnée trouvée
        </p>
      ) : (
        <ol className="flex flex-col gap-4">
          {products.map((product, index) => (
            <li key={product.id} className="flex items-center gap-3">
              <span className="w-4 text-center text-xs font-semibold text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt="" className="size-full object-cover" />
                ) : (
                  <Package className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {formatPrice(product.sales)}
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(product.quantity / maxQuantity) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs font-medium tabular-nums">
                    {product.quantity} livrés
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </DashboardWidget>
  )
}
