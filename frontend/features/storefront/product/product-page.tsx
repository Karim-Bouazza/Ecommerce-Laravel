"use client"

import { useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronRight, Link2, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react"
import { cn } from "cn"

import { formatPrice } from "@/shared/lib/format-price"
import { trackViewContent } from "@/features/pixels/lib/track-events"
import type { StorefrontProductDetail } from "@/features/storefront/catalog/api/products-api"
import { CodOrderForm } from "./cod-order-form"
import { ProductGallery } from "./product-gallery"
import { MOCK_RATING } from "./product-data"

const GUARANTEES = [
  { icon: Truck, label: "Livraison 58 wilayas" },
  { icon: ShieldCheck, label: "Garantie 12 mois" },
  { icon: RotateCcw, label: "Retour sous 7 jours" },
]

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex items-center gap-0.5" aria-label={`Note ${value.toFixed(1)} sur 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="font-medium">{value.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviews} avis)</span>
    </div>
  )
}

function copyLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => toast.success("Lien copié"))
    .catch(() => toast.error("Impossible de copier le lien"))
}

export function ProductPage({ product }: { product: StorefrontProductDetail }) {
  const inStock = product.in_stock
  const subtitle = [product.category, product.brand].filter(Boolean).join(" · ")

  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    })
  }, [product.id, product.name, product.price, product.category])

  return (
    <main className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="transition-colors hover:text-foreground">
          Produits
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  inStock
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "border-border bg-muted text-muted-foreground"
                )}
              >
                {inStock ? "En stock" : "Rupture de stock"}
              </span>
            </div>
            <div className="mt-2">
              <Rating value={MOCK_RATING.value} reviews={MOCK_RATING.reviews} />
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_price !== null && product.compare_price > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
            {product.discount_percentage !== null && (
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                -{product.discount_percentage}%
              </span>
            )}
          </div>

          {product.short_description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.short_description}
            </p>
          )}

          {inStock ? (
            <CodOrderForm product={product} />
          ) : (
            <div className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Ce produit est momentanément indisponible.
            </div>
          )}

          <ul className="grid grid-cols-3 gap-2">
            {GUARANTEES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-muted/60 px-2 py-3 text-center text-xs font-medium"
              >
                <Icon className="size-5 text-primary" />
                {label}
              </li>
            ))}
          </ul>

          <dl className="space-y-2 border-t border-border pt-5 text-sm">
            {product.sku && (
              <div className="flex gap-2">
                <dt className="font-medium">Référence :</dt>
                <dd className="text-muted-foreground">{product.sku}</dd>
              </div>
            )}
            {product.tags.length > 0 && (
              <div className="flex gap-2">
                <dt className="font-medium">Tags :</dt>
                <dd className="text-muted-foreground">{product.tags.join(", ")}</dd>
              </div>
            )}
            <div className="flex items-center gap-2">
              <dt className="font-medium">Partager :</dt>
              <dd>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <Link2 className="size-3.5" />
                  Copier le lien
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section aria-labelledby="product-details" className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 id="product-details" className="text-lg font-semibold">
            Description
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>{product.description}</p>
          </div>
        </div>
        {product.specs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Caractéristiques</h2>
            <dl className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border text-sm">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[40%_1fr] gap-3 px-4 py-3">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>
    </main>
  )
}
