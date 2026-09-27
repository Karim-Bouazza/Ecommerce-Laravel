"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/shared/lib/format-price";
import { useDealsOfTheDay } from "@/features/storefront/catalog/use-deals-of-the-day";

const SKELETON_COUNT = 5;

function CarouselNextFloating() {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      type="button"
      aria-label="Suivant"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className="absolute top-[38%] right-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
    >
      <ChevronRight className="size-4" />
    </button>
  );
}

export function FeaturedCarousel() {
  const { data: deals = [], isPending, isError } = useDealsOfTheDay();

  if (isError || (!isPending && deals.length === 0)) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className="rounded-3xl bg-muted/40 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Meilleures Offres <span className="text-primary">du Jour</span> !
          </h2>
          <span className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:text-sm">
            Se termine dans : 12 : 10 : 09
          </span>
        </div>

        <Carousel opts={{ align: "start" }} className="mt-6">
          <CarouselContent>
            {isPending
              ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <CarouselItem
                    key={`deal-skeleton-${index}`}
                    className="basis-[42%] sm:basis-[30%] lg:basis-[19%]"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-sm">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <div className="mt-3 space-y-2 px-2 pb-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-5 w-2/3" />
                      </div>
                    </div>
                  </CarouselItem>
                ))
              : deals.map((deal) => (
                  <CarouselItem
                    key={deal.id}
                    className="basis-[42%] sm:basis-[30%] lg:basis-[19%]"
                  >
                    <div className="group overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-sm">
                      <div className="relative overflow-hidden rounded-xl bg-muted/50">
                        <Link
                          href={`/products/${deal.id}`}
                          aria-label={deal.name}
                        >
                          {deal.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={deal.image}
                              alt={deal.name}
                              loading="lazy"
                              className={cn(
                                "aspect-square w-full object-cover",
                                !deal.in_stock && "opacity-50 grayscale",
                              )}
                            />
                          ) : (
                            <div
                              aria-hidden
                              className="flex aspect-square w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground"
                            >
                              {deal.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </Link>

                        {deal.discount_percentage !== null && (
                          <span className="absolute top-2 left-2 rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                            -{deal.discount_percentage}%
                          </span>
                        )}

                        {!deal.in_stock && (
                          <span className="absolute inset-x-2 bottom-2 rounded-full bg-background/90 py-1.5 text-center text-xs font-medium text-muted-foreground backdrop-blur">
                            Rupture de stock
                          </span>
                        )}
                      </div>

                      <div className="mt-3 px-2 pb-3">
                        <p className="truncate text-sm font-semibold text-foreground">
                          <Link href={`/products/${deal.id}`}>{deal.name}</Link>
                        </p>
                        {deal.compare_price !== null &&
                          deal.compare_price > deal.price && (
                            <p className="mt-1 text-xs text-muted-foreground line-through">
                              {formatPrice(deal.compare_price)}
                            </p>
                          )}
                        <p className="text-base font-bold text-foreground">
                          {formatPrice(deal.price)}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>

          <CarouselNextFloating />
        </Carousel>
      </div>
    </section>
  );
}
