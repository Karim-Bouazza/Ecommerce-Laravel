"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { cn } from "cn"
import { formatPrice } from "@/shared/lib/format-price"
import type { CatalogProduct } from "./catalog-data"

export function ProductCard({ product }: { product: CatalogProduct }) {
  const [liked, setLiked] = useState(false)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={cn(
            "aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105",
            !product.inStock && "opacity-50 grayscale"
          )}
        />

        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-md bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
              Nouveau
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={liked ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
          aria-pressed={liked}
          // TODO: brancher sur la liste de favoris
          onClick={() => setLiked((v) => !v)}
          className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-colors hover:text-red-500"
        >
          <Heart className={cn("size-4", liked && "fill-red-500 text-red-500")} />
        </button>

        {!product.inStock && (
          <span className="absolute inset-x-2 bottom-2 rounded-full bg-background/90 py-1.5 text-center text-xs font-medium text-muted-foreground backdrop-blur">
            Rupture de stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-0.5" aria-label={`Note ${product.rating.toFixed(1)} sur 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="ml-1 font-medium text-foreground">{product.rating.toFixed(1)}</span>
          <span>({product.reviews})</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          <Link href={`/products/${product.id}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
