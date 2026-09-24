import { CircleCheck } from "lucide-react";
import { cn } from "cn";

type Feature = {
  title: string;
  description: string;
  image: string;
  className: string;
};

const FEATURES: Feature[] = [
  {
    title: "Vision Nocturne 4K",
    description:
      "Des images nettes jour et nuit grâce aux capteurs infrarouges haute sensibilité.",
    image: "https://picsum.photos/seed/feature-night-vision-4k/900/500",
    className: "lg:col-span-7",
  },
  {
    title: "Résistant aux Intempéries",
    description:
      "Boîtiers certifiés IP67 — pluie, poussière et chaleur ne sont plus un problème.",
    image: "https://picsum.photos/seed/feature-weatherproof/700/500",
    className: "lg:col-span-5",
  },
  {
    title: "Installation Facile",
    description:
      "Configuration en quelques minutes, sans câblage complexe ni outils spéciaux.",
    image: "https://picsum.photos/seed/feature-easy-install/600/500",
    className: "lg:col-span-4",
  },
  {
    title: "Contrôle Mobile",
    description:
      "Surveillez et recevez des alertes en temps réel depuis votre smartphone.",
    image: "https://picsum.photos/seed/feature-mobile-control/500/500",
    className: "lg:col-span-3",
  },
  {
    title: "Support 24/7",
    description:
      "Une équipe d'experts disponible à tout moment, avec une garantie de 2 ans.",
    image: "https://picsum.photos/seed/feature-support-247/700/500",
    className: "lg:col-span-5",
  },
];

export function ProductFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground uppercase sm:text-4xl">
        Nos <span className="text-primary">Atouts</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Conçus pour protéger. Pensés pour durer.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12 lg:gap-8">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={cn(
              "group relative h-44 overflow-hidden rounded-3xl bg-muted sm:h-52",
              feature.className
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={feature.image}
              alt={feature.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-black/35 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <CircleCheck className="size-4 shrink-0 text-primary" />
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-0.5 line-clamp-2 pl-6 text-xs text-white/80">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
