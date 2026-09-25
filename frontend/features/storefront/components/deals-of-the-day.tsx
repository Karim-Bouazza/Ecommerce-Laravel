"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";

type Deal = {
  name: string;
  image: string;
  price: number;
  specs: string[];
  colors: string[];
};

const FEATURED_DEAL: Deal = {
  name: "Système de Sécurité Pro 4K",
  image: "https://picsum.photos/seed/security-system-pro-4k/700/700",
  price: 249,
  specs: ["4K", "8 ch", "Wi-Fi"],
  colors: ["#111111", "#6b7c75", "#2d9cdb", "#f97316"],
};

const SMALL_DEALS: Deal[] = [
  {
    name: "Caméra Extérieure 360°",
    image: "https://picsum.photos/seed/outdoor-camera-360/300/300",
    price: 79,
    specs: ["2K", "IP67", "Wi-Fi"],
    colors: ["#1e2a44", "#4b4b45", "#111111", "#c8574f"],
  },
  {
    name: "Détecteur de Fumée Connecté",
    image: "https://picsum.photos/seed/smoke-detector-connected/300/300",
    price: 35,
    specs: ["Zigbee", "10 ans", "85 dB"],
    colors: ["#1e2a44", "#d9d4cc", "#f97316", "#c8574f"],
  },
  {
    name: "Sirène d'Alarme Extérieure",
    image: "https://picsum.photos/seed/outdoor-alarm-siren/300/300",
    price: 59,
    specs: ["110 dB", "IP65", "LED"],
    colors: ["#f97316", "#6b7c75", "#c9c9c0", "#b8e986"],
  },
  {
    name: "Interphone Vidéo Compact",
    image: "https://picsum.photos/seed/compact-video-intercom/300/300",
    price: 65,
    specs: ["1080p", "7\"", "PoE"],
    colors: ["#6b7280", "#5b6ad0", "#111111", "#2f3a56"],
  },
];

function DealCard({ deal, featured = false }: { deal: Deal; featured?: boolean }) {
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
              "mt-1 font-medium text-primary",
              featured ? "text-2xl sm:text-3xl" : "text-sm sm:text-base"
            )}
          >
            ${deal.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden",
          featured ? "h-48 sm:h-56 lg:h-64" : "h-28 sm:h-32"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deal.image}
          alt={deal.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
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
          <div className="flex gap-1.5">
            {deal.colors.map((color) => (
              <span
                key={color}
                className={cn("rounded-full", featured ? "size-6" : "size-2.5")}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <Link
          href="/products"
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

export function DealsOfTheDay() {
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
        <DealCard deal={FEATURED_DEAL} featured />

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {SMALL_DEALS.map((deal) => (
            <DealCard key={deal.name} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}
