import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "CCTV Cameras",
    image: "https://picsum.photos/seed/cctv-cameras-security/240/240",
  },
  {
    name: "Alarm Systems",
    image: "https://picsum.photos/seed/alarm-systems-security/240/240",
  },
  {
    name: "Access Control",
    image: "https://picsum.photos/seed/access-control-security/240/240",
  },
  {
    name: "Video Intercoms",
    image: "https://picsum.photos/seed/video-intercoms-security/240/240",
  },
  {
    name: "Sensors & Detectors",
    image: "https://picsum.photos/seed/sensors-detectors-security/240/240",
  },
];

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Shop by Category
        </h2>
        <Link
          href="/categories"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          View All Categories
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => (
          <div
            key={category.name}
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              index === 0
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image}
              alt={category.name}
              className="size-18 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {category.name}
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
