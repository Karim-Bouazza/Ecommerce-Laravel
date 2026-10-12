"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "cn";

import type { SectionProduct } from "@/features/site-settings/types";
import { formatPrice } from "@/shared/lib/format-price";

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
  product: SectionProduct;
  isActive: boolean;
}) {
  return (
    <div className="flex flex-col rounded-3xl bg-muted p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium text-foreground">{product.name}</h3>
        {product.label && (
          <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium text-background">
            {product.label}
          </span>
        )}
      </div>
      {product.short_description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {product.short_description}
        </p>
      )}
      <p className="mt-2 text-base font-medium text-primary">{formatPrice(product.price)}</p>

      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          className="mt-4 h-44 w-full rounded-2xl object-cover sm:h-52"
        />
      ) : (
        <div className="mt-4 flex h-44 w-full items-center justify-center rounded-2xl bg-background text-4xl font-semibold text-muted-foreground sm:h-52">
          {product.name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {product.images.slice(1, 4).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              draggable={false}
              className="size-8 rounded-md border border-border object-cover"
            />
          ))}
        </div>
        <Link
          href={`/products/${product.product_id}`}
          tabIndex={isActive ? 0 : -1}
          draggable={false}
          aria-label={`Commander ${product.name}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105"
        >
          Commander
          <ShoppingBag aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function ChooseYourStyle({ products }: { products: SectionProduct[] }) {
  const total = products.length;
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
    // No autoplay with a single card, while hovered/focused, or when motion is reduced.
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, total]);

  if (total === 0) {
    return null;
  }

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
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative mt-10 h-110 overflow-hidden sm:h-120"
      >
        {products.map((product, index) => {
          const offset = getOffset(index, active, total);
          const distance = Math.abs(offset);
          const isActive = offset === 0;
          const x =
            distance === 0
              ? 0
              : Math.sign(offset) * (spacing + (distance - 1) * spacing * 0.8);

          return (
            <motion.div
              key={product.id}
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
        {products.map((product, index) => (
          <button
            key={product.id}
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
