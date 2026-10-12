import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import type { SectionProduct } from "@/features/site-settings/types";
import { formatPrice } from "@/shared/lib/format-price";

function DealCard({ deal, featured = false }: { deal: SectionProduct; featured?: boolean }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-muted/60">
      <div
        className={cn(
          "flex items-start",
          featured ? "p-6 pb-3 sm:p-8 sm:pb-4" : "p-3 pb-2 sm:p-4 sm:pb-2"
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              "font-medium text-foreground",
              featured ? "text-2xl sm:text-3xl" : "truncate text-sm sm:text-base"
            )}
          >
            {deal.name}
          </h3>
          <p
            className={cn(
              "mt-1 flex flex-wrap items-baseline gap-x-2 font-medium text-primary",
              featured ? "text-2xl sm:text-3xl" : "text-sm sm:text-base"
            )}
          >
            {formatPrice(deal.price)}
            {deal.compare_price !== null && (
              <span className="text-xs font-normal text-muted-foreground line-through">
                {formatPrice(deal.compare_price)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden",
          featured ? "h-48 sm:h-56 lg:h-64" : "h-28 sm:h-32"
        )}
      >
        {deal.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.image}
            alt={deal.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-4xl font-semibold text-muted-foreground">
            {deal.name.charAt(0).toUpperCase()}
          </div>
        )}
        {deal.discount_percentage !== null && (
          <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            -{deal.discount_percentage}%
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex items-end justify-between gap-3",
          featured ? "p-6 pt-3 sm:p-8 sm:pt-4" : "p-3 pt-2 sm:p-4 sm:pt-2"
        )}
      >
        <div className={featured ? "space-y-3" : "space-y-1.5"}>
          <div className="flex flex-wrap gap-1">
            {deal.specs.map((spec) => (
              <span
                key={spec}
                className={cn(
                  "rounded-full border border-border bg-white/60 text-muted-foreground",
                  featured ? "px-2.5 py-1 text-xs" : "px-1.5 py-0.5 text-[9px]"
                )}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/products/${deal.product_id}`}
          aria-label={`Voir ${deal.name}`}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105",
            featured ? "size-16 sm:size-20" : "size-7"
          )}
        >
          <ArrowRight className={featured ? "size-7 sm:size-8" : "size-3.5"} />
        </Link>
      </div>
    </div>
  );
}

export function DealsOfTheDay({ offers }: { offers: SectionProduct[] }) {
  if (offers.length === 0) {
    return null;
  }

  const [featured, ...others] = offers;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <span className="h-px w-6 bg-primary" />
        Offres du Jour
      </div>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Les <span className="text-primary">Meilleures Offres</span>
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <DealCard deal={featured} featured />

        {others.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {others.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
