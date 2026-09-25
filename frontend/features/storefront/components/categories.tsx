import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroCategory } from "@/features/site-settings/types";

export function Categories({ items = [] }: { items?: HeroCategory[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Shop by Category
        </h2>
        <Link
          href="/products"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          View All Categories
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((category, index) => (
          <div
            key={category.id}
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              index === 0
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image_url ?? undefined}
              alt={category.category_name}
              className="size-18 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {category.category_name}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                View Products
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
