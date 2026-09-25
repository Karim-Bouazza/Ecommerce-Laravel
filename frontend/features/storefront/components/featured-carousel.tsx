"use client";

import { ChevronRight, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

type Deal = {
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  sold: number;
};

const TODAY_DEALS: Deal[] = [
  {
    name: "HD Dome CCTV Camera",
    image: "https://picsum.photos/seed/deal-dome-cctv-camera/400/400",
    price: 89,
    originalPrice: 178,
    rating: 4.9,
    sold: 652,
  },
  {
    name: "Wireless Alarm Panel Kit",
    image: "https://picsum.photos/seed/deal-alarm-panel-kit/400/400",
    price: 150,
    originalPrice: 210,
    rating: 4.8,
    sold: 412,
  },
  {
    name: "Smart Access Control Reader",
    image: "https://picsum.photos/seed/deal-access-control-reader/400/400",
    price: 210,
    originalPrice: 260,
    rating: 4.9,
    sold: 901,
  },
  {
    name: "Video Door Intercom",
    image: "https://picsum.photos/seed/deal-video-door-intercom/400/400",
    price: 95,
    originalPrice: 130,
    rating: 4.9,
    sold: 516,
  },
  {
    name: "PIR Motion Sensor",
    image: "https://picsum.photos/seed/deal-pir-motion-sensor/400/400",
    price: 28,
    originalPrice: 40,
    rating: 4.9,
    sold: 129,
  },
  {
    name: "Smart Door Lock",
    image: "https://picsum.photos/seed/deal-smart-door-lock/400/400",
    price: 130,
    originalPrice: 165,
    rating: 4.8,
    sold: 340,
  },
];

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
            {TODAY_DEALS.map((deal) => (
              <CarouselItem
                key={deal.name}
                className="basis-[42%] sm:basis-[30%] lg:basis-[19%]"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-white p-1 shadow-sm">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </div>

                  <div className="mt-3 px-2 pb-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {deal.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3.5 fill-primary text-primary" />
                      <span className="font-medium text-foreground">
                        {deal.rating.toFixed(1)}
                      </span>
                      · {deal.sold} vendus
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-through">
                      ${deal.originalPrice.toFixed(2)}
                    </p>
                    <p className="text-base font-bold text-foreground">
                      ${deal.price.toFixed(2)}
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
