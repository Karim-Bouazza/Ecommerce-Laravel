import { CircleCheck } from "lucide-react";
import { cn } from "cn";

import type { StorefrontFeature } from "@/features/site-settings/types";

// Bento column spans (out of 12 on large screens) for each number of cards.
const LAYOUTS: Record<number, string[]> = {
  1: ["lg:col-span-12"],
  2: ["lg:col-span-7", "lg:col-span-5"],
  3: ["lg:col-span-4", "lg:col-span-4", "lg:col-span-4"],
  4: ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"],
  5: ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-3", "lg:col-span-5"],
};

export function ProductFeatures({ features }: { features: StorefrontFeature[] }) {
  if (features.length === 0) {
    return null;
  }

  const spans = LAYOUTS[features.length] ?? LAYOUTS[5];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground uppercase sm:text-4xl">
        Nos <span className="text-primary">Atouts</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Conçus pour protéger. Pensés pour durer.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12 lg:gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={cn(
              "group relative h-44 overflow-hidden rounded-3xl bg-muted sm:h-52",
              spans[index % spans.length]
            )}
          >
            {feature.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={feature.image_url}
                alt={feature.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            )}

            <div className="absolute inset-x-0 bottom-0 bg-black/35 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-primary" />
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  {feature.title}
                </h3>
              </div>
              {feature.description && (
                <p className="mt-0.5 line-clamp-2 pl-6 text-xs text-white/80">
                  {feature.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
