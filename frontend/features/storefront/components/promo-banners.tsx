import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";

import type { StorefrontPromoBanner } from "@/features/site-settings/types";

export function PromoBanners({ banners }: { banners: StorefrontPromoBanner[] }) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className={cn("grid grid-cols-1 gap-5 lg:gap-8", banners.length > 1 && "lg:grid-cols-2")}>
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={cn(
              "relative flex min-h-72 overflow-hidden rounded-3xl sm:min-h-80",
              banner.highlight
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-foreground"
            )}
          >
            <div className="relative z-10 flex w-3/5 flex-col justify-center p-6 sm:p-10">
              {banner.eyebrow && <p className="text-sm sm:text-lg">{banner.eyebrow}</p>}
              <h3 className="mt-2 text-2xl leading-tight font-bold sm:text-4xl">{banner.title}</h3>
              {banner.description && (
                <p
                  className={cn(
                    "mt-4 line-clamp-3 text-xs sm:text-sm",
                    banner.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {banner.description}
                </p>
              )}
              <Link
                href={banner.link_url ?? "/products"}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105 sm:px-7 sm:py-3.5"
              >
                {banner.button_label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            {banner.image_url && (
              <div className="absolute inset-y-0 right-0 w-2/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
