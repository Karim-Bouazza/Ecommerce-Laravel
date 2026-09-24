"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { cn } from "cn";

type StyleProduct = {
  name: string;
  badge: string;
  description: string;
  price: number;
  image: string;
  variants: string[];
};

const STYLE_PRODUCTS: StyleProduct[] = [
  {
    name: "Caméra Dôme D200",
    badge: "Meilleur Prix",
    description: "Compacte et discrète pour l'intérieur",
    price: 89.99,
    image: "https://picsum.photos/seed/style-dome-d200/500/500",
    variants: ["style-dome-d200-a", "style-dome-d200-b", "style-dome-d200-c"],
  },
  {
    name: "Bullet Cam B360",
    badge: "Léger",
    description: "Vision longue portée et boîtier robuste",
    price: 115.49,
    image: "https://picsum.photos/seed/style-bullet-b360/500/500",
    variants: ["style-bullet-b360-a", "style-bullet-b360-b", "style-bullet-b360-c"],
  },
  {
    name: "Vision Pro LX 500",
    badge: "Meilleure Vente",
    description: "Conçue pour l'extérieur avec rotation 360° et vision nocturne.",
    price: 139.99,
    image: "https://picsum.photos/seed/style-vision-pro-lx500/500/500",
    variants: ["style-lx500-a", "style-lx500-b", "style-lx500-c"],
  },
  {
    name: "Sonnette Vidéo S2",
    badge: "Favori",
    description: "Voyez et parlez à vos visiteurs à distance",
    price: 129.5,
    image: "https://picsum.photos/seed/style-doorbell-s2/500/500",
    variants: ["style-doorbell-s2-a", "style-doorbell-s2-b", "style-doorbell-s2-c"],
  },
  {
    name: "Alarme Core X2",
    badge: "Nouveau",
    description: "Centrale sans fil et sirène intégrée",
    price: 105.99,
    image: "https://picsum.photos/seed/style-alarm-core-x2/500/500",
    variants: ["style-alarm-x2-a", "style-alarm-x2-b", "style-alarm-x2-c"],
  },
  {
    name: "Serrure Smart K7",
    badge: "Pro",
    description: "Déverrouillage par empreinte et code",
    price: 159.0,
    image: "https://picsum.photos/seed/style-smart-lock-k7/500/500",
    variants: ["style-lock-k7-a", "style-lock-k7-b", "style-lock-k7-c"],
  },
  {
    name: "Détecteur Eco M1",
    badge: "Éco",
    description: "Autonomie de 5 ans, pose sans outils",
    price: 39.9,
    image: "https://picsum.photos/seed/style-motion-eco-m1/500/500",
    variants: ["style-eco-m1-a", "style-eco-m1-b", "style-eco-m1-c"],
  },
];

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 60;

// Shortest signed distance from the active card, so the carousel loops.
function getOffset(index: number, active: number, total: number) {
  let offset = (index - active) % total;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function StyleCard({
  product,
  isActive,
}: {
  product: StyleProduct;
  isActive: boolean;
}) {
  return (
    <div className="flex flex-col rounded-3xl bg-muted p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium text-foreground">{product.name}</h3>
        <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium text-background">
          {product.badge}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
        {product.description}
      </p>
      <p className="mt-2 text-base font-medium text-primary">
        ${product.price.toFixed(2)}
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        draggable={false}
        className="mt-4 h-44 w-full rounded-2xl object-cover sm:h-52"
      />

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {product.variants.map((seed) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={seed}
              src={`https://picsum.photos/seed/${seed}/80/80`}
              alt=""
              draggable={false}
              className="size-8 rounded-md border border-border object-cover"
            />
          ))}
        </div>
        <button
          type="button"
          tabIndex={isActive ? 0 : -1}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105"
        >
          Ajouter
          <ShoppingBag className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ChooseYourStyle() {
  const total = STYLE_PRODUCTS.length;
  const [active, setActive] = useState(Math.floor(total / 2));
  const [paused, setPaused] = useState(false);
  const [spacing, setSpacing] = useState(260);
  const trackRef = useRef<HTMLDivElement>(null);

  const next = () => setActive((i) => (i + 1) % total);
  const prev = () => setActive((i) => (i - 1 + total) % total);

  // Horizontal distance between cards follows the track width.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(([entry]) => {
      setSpacing(Math.min(entry.contentRect.width * 0.23, 280));
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, total]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) next();
    else if (info.offset.x > SWIPE_THRESHOLD) prev();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground uppercase sm:text-4xl">
        Choisissez <span className="text-primary">Votre Style</span>
      </h2>

      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative mt-10 h-110 overflow-hidden sm:h-120"
      >
        {STYLE_PRODUCTS.map((product, index) => {
          const offset = getOffset(index, active, total);
          const distance = Math.abs(offset);
          const isActive = offset === 0;
          const x =
            distance === 0
              ? 0
              : Math.sign(offset) * (spacing + (distance - 1) * spacing * 0.8);

          return (
            <motion.div
              key={product.name}
              initial={false}
              animate={{
                x,
                scale: isActive ? 1 : distance === 1 ? 0.82 : 0.66,
                opacity: distance > 2 ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ zIndex: 10 - distance }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => !isActive && setActive(index)}
              aria-hidden={distance > 2}
              className={cn(
                "absolute inset-0 m-auto h-fit w-64 sm:w-72",
                isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                distance > 2 && "pointer-events-none"
              )}
            >
              <StyleCard product={product} isActive={isActive} />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {STYLE_PRODUCTS.map((product, index) => (
          <button
            key={product.name}
            type="button"
            aria-label={`Afficher ${product.name}`}
            onClick={() => setActive(index)}
            className={cn(
              "h-3 rounded-full transition-all duration-300",
              index === active ? "w-9 bg-primary/60" : "w-3 bg-primary/15 hover:bg-primary/30"
            )}
          />
        ))}
      </div>
    </section>
  );
}
