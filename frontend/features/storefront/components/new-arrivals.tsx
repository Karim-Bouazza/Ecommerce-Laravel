import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { cn } from "cn";

import type { SectionProduct } from "@/features/site-settings/types";
import { formatPrice } from "@/shared/lib/format-price";

function OrderLink({ item, small = false }: { item: SectionProduct; small?: boolean }) {
  return (
    <Link
      href={`/products/${item.product_id}`}
      aria-label={`Commander ${item.name}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105",
        small ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"
      )}
    >
      Commander
      <ShoppingBag aria-hidden="true" className={small ? "size-3.5" : "size-4"} />
    </Link>
  );
}

function ProductImage({ item, className }: { item: SectionProduct; className?: string }) {
  return item.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.image} alt={item.name} loading="lazy" className={cn("object-cover", className)} />
  ) : (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground",
        className
      )}
    >
      {item.name.charAt(0).toUpperCase()}
    </div>
  );
}

export function NewArrivals({ items }: { items: SectionProduct[] }) {
  if (items.length === 0) {
    return null;
  }

  const [featured, wide, ...small] = items;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground uppercase sm:text-4xl">
          Nouveautés
        </h2>
        <Link
          href="/products?sort=newest"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Voir plus
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className={cn("mt-8 grid grid-cols-1 gap-5 lg:gap-6", wide && "lg:grid-cols-2")}>
        {/* Featured: sits in the right column; image on the left, content on the right */}
        <div className="grid min-h-80 grid-cols-1 overflow-hidden rounded-3xl bg-muted/60 sm:grid-cols-2 lg:order-2">
          <div className="relative h-56 sm:h-full">
            <ProductImage item={featured} className="absolute inset-0 h-full w-full" />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <h3 className="text-2xl font-medium text-foreground sm:text-3xl">{featured.name}</h3>
            <p className="mt-1 text-2xl font-medium text-primary sm:text-3xl">
              {formatPrice(featured.price)}
            </p>

            {featured.label && (
              <p className="mt-8 text-3xl leading-tight font-bold text-primary italic sm:text-4xl">
                {featured.label}
              </p>
            )}

            <div className="mt-6">
              <OrderLink item={featured} />
            </div>
          </div>
        </div>

        {wide && (
          <div className="grid grid-cols-2 content-start gap-5 lg:gap-6">
            <div className="col-span-2 grid grid-cols-2 overflow-hidden rounded-3xl bg-muted/60">
              <div className="flex flex-col justify-center p-5 sm:p-6">
                <h3 className="text-lg font-medium text-foreground sm:text-xl">{wide.name}</h3>
                <p className="mt-1 text-lg font-medium text-primary sm:text-xl">
                  {formatPrice(wide.price)}
                </p>
                <div className="mt-5">
                  <OrderLink item={wide} small />
                </div>
              </div>
              <div className="relative min-h-44">
                <ProductImage item={wide} className="absolute inset-0 h-full w-full" />
              </div>
            </div>

            {small.map((item) => (
              <div key={item.id} className="flex flex-col overflow-hidden rounded-3xl bg-muted/60">
                <div className="p-4 pb-3">
                  <h3 className="truncate text-sm font-medium text-foreground sm:text-base">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-primary sm:text-sm">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <ProductImage item={item} className="h-28 w-full sm:h-32" />
                <div className="flex justify-center p-3">
                  <OrderLink item={item} small />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
