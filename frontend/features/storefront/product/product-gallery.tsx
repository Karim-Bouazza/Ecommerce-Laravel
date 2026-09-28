"use client";

import { useRef, useState } from "react";
import { cn } from "cn";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const count = images.length;
  const go = (step: number) => setActive((i) => (i + step + count) % count);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;

    swipeStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    go(deltaX < 0 ? 1 : -1);
  };

  const handlePointerCancel = () => {
    swipeStart.current = null;
  };

  if (count === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-muted/60 text-sm text-muted-foreground">
        Aucune image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square w-full touch-pan-y overflow-hidden rounded-3xl bg-muted/60"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${name} – image ${active + 1} sur ${count}`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {count > 1 && (
          <span
            aria-live="polite"
            aria-label={`Image ${active + 1} sur ${count}`}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/75 px-3 py-1 text-sm font-semibold tabular-nums text-background backdrop-blur-sm"
          >
            {active + 1} / {count}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Afficher l'image ${index + 1}`}
            aria-current={index === active}
            className={cn(
              "overflow-hidden rounded-2xl border-2 bg-muted/60 transition-colors",
              index === active
                ? "border-primary"
                : "border-transparent hover:border-border",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
