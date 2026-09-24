"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "cn"

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const count = images.length
  const go = (step: number) => setActive((i) => (i + step + count) % count)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-3xl bg-muted/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${name} – image ${active + 1} sur ${count}`}
          className="aspect-square w-full object-cover"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Image précédente"
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-opacity hover:opacity-90"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Image suivante"
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
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
              index === active ? "border-primary" : "border-transparent hover:border-border"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
