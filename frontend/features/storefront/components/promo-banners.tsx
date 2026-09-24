import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";

type PromoBanner = {
  discount: string;
  title: string;
  description: string;
  image: string;
  highlight: boolean;
};

const PROMO_BANNERS: PromoBanner[] = [
  {
    discount: "Remise de 20%",
    title: "Nouvelles Caméras Connectées",
    description:
      "Surveillez votre maison en temps réel, où que vous soyez, en haute définition.",
    image: "https://picsum.photos/seed/promo-smart-cameras/500/600",
    highlight: false,
  },
  {
    discount: "Remise de 15%",
    title: "Collection Alarmes Sans Fil",
    description:
      "Une protection complète installée en quelques minutes, sans travaux.",
    image: "https://picsum.photos/seed/promo-wireless-alarms/500/600",
    highlight: true,
  },
];

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
        {PROMO_BANNERS.map((banner) => (
          <div
            key={banner.title}
            className={cn(
              "relative flex min-h-72 overflow-hidden rounded-3xl sm:min-h-80",
              banner.highlight
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-foreground"
            )}
          >
            <div className="relative z-10 flex w-3/5 flex-col justify-center p-6 sm:p-10">
              <p className="text-sm sm:text-lg">{banner.discount}</p>
              <h3 className="mt-2 text-2xl leading-tight font-bold sm:text-4xl">
                {banner.title}
              </h3>
              <p
                className={cn(
                  "mt-4 line-clamp-3 text-xs sm:text-sm",
                  banner.highlight
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {banner.description}
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105 sm:px-7 sm:py-3.5"
              >
                Acheter
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="absolute inset-y-0 right-0 w-2/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
