"use client"

import Link from "next/link"
import { cn } from "cn"
import { formatPrice } from "@/shared/lib/format-price"
import type { StorefrontProduct } from "./api/products-api"

export function ProductCard({ product }: { product: StorefrontProduct }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image ?? undefined}
          alt={product.name}
          loading="lazy"
          className={cn(
            "aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105",
            !product.in_stock && "opacity-50 grayscale"
          )}
        />

        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
          {product.discount_percentage !== null && (
            <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
              -{product.discount_percentage}%
            </span>
          )}
          {product.is_new && (
            <span className="rounded-md bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
              Nouveau
            </span>
          )}
        </div>

        {!product.in_stock && (
          <span className="absolute inset-x-2 bottom-2 rounded-full bg-background/90 py-1.5 text-center text-xs font-medium text-muted-foreground backdrop-blur">
            Rupture de stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          <Link href={`/products/${product.id}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.compare_price !== null && product.compare_price > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
