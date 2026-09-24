import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { cn } from "cn";

type Arrival = {
  name: string;
  image: string;
  price: number;
};

const FEATURED_ARRIVAL: Arrival = {
  name: "Caméra PTZ Vision X9",
  image: "https://picsum.photos/seed/arrival-ptz-vision-x9/700/800",
  price: 129.99,
};

const WIDE_ARRIVAL: Arrival = {
  name: "Kit Alarme Sans Fil Z4",
  image: "https://picsum.photos/seed/arrival-alarm-kit-z4/500/400",
  price: 135.99,
};

const SMALL_ARRIVALS: Arrival[] = [
  {
    name: "Serrure Connectée T3",
    image: "https://picsum.photos/seed/arrival-smart-lock-t3/400/300",
    price: 108.99,
  },
  {
    name: "Détecteur Mouvement G8",
    image: "https://picsum.photos/seed/arrival-motion-sensor-g8/400/300",
    price: 119.99,
  },
];

function AddToCartButton({ small = false }: { small?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105",
        small ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"
      )}
    >
      Ajouter au panier
      <ShoppingBag className={small ? "size-3.5" : "size-4"} />
    </button>
  );
}

export function NewArrivals() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground uppercase sm:text-4xl">
          Nouveautés
        </h2>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Voir plus
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        {/* Featured: sits in the right column; image on the left, content on the right */}
        <div className="grid min-h-80 grid-cols-1 overflow-hidden rounded-3xl bg-muted/60 sm:grid-cols-2 lg:order-2">
          <div className="relative h-56 sm:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURED_ARRIVAL.image}
              alt={FEATURED_ARRIVAL.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <h3 className="text-2xl font-medium text-foreground sm:text-3xl">
              {FEATURED_ARRIVAL.name}
            </h3>
            <p className="mt-1 text-2xl font-medium text-primary sm:text-3xl">
              ${FEATURED_ARRIVAL.price.toFixed(2)}
            </p>

            <p className="mt-8 text-3xl leading-tight font-bold italic sm:text-4xl">
              <span className="text-primary">Nouvelle Gamme</span>
              <br />
              <span className="text-foreground">Sécurité Totale</span>
            </p>

            <div className="mt-6">
              <AddToCartButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:gap-6">
          <div className="col-span-2 grid grid-cols-2 overflow-hidden rounded-3xl bg-muted/60">
            <div className="flex flex-col justify-center p-5 sm:p-6">
              <h3 className="text-lg font-medium text-foreground sm:text-xl">
                {WIDE_ARRIVAL.name}
              </h3>
              <p className="mt-1 text-lg font-medium text-primary sm:text-xl">
                ${WIDE_ARRIVAL.price.toFixed(2)}
              </p>
              <div className="mt-5">
                <AddToCartButton small />
              </div>
            </div>
            <div className="relative min-h-44">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={WIDE_ARRIVAL.image}
                alt={WIDE_ARRIVAL.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>

          {SMALL_ARRIVALS.map((item) => (
            <div
              key={item.name}
              className="flex flex-col overflow-hidden rounded-3xl bg-muted/60"
            >
              <div className="p-4 pb-3">
                <h3 className="truncate text-sm font-medium text-foreground sm:text-base">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-primary sm:text-sm">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-full object-cover sm:h-32"
              />
              <div className="flex justify-center p-3">
                <AddToCartButton small />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
