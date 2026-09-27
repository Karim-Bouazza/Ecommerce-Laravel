"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { formatPrice } from "@/shared/lib/format-price";
import {
  getStorefrontProducts,
  type StorefrontProduct,
} from "@/features/storefront/catalog/api/products-api";

type ProductTag = "latest" | "bestseller" | "featured";

type Product = {
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  tags: ProductTag[];
};

const PRODUCTS: Product[] = [
  {
    name: "HD Dome CCTV Camera",
    category: "CCTV Cameras",
    image: "https://picsum.photos/seed/dome-cctv-camera/400/400",
    price: 89,
    originalPrice: 178,
    discountPercent: 50,
    rating: 4.9,
    tags: ["latest", "bestseller"],
  },
  {
    name: "Wireless Alarm Panel Kit",
    category: "Alarm Systems",
    image: "https://picsum.photos/seed/wireless-alarm-panel/400/400",
    price: 150,
    originalPrice: 170,
    discountPercent: 10,
    rating: 4.7,
    tags: ["latest"],
  },
  {
    name: "Smart Access Control Reader",
    category: "Access Control",
    image: "https://picsum.photos/seed/access-control-reader/400/400",
    price: 210,
    originalPrice: 230,
    discountPercent: 10,
    rating: 4.8,
    tags: ["featured"],
  },
  {
    name: "Video Door Intercom",
    category: "Video Intercoms",
    image: "https://picsum.photos/seed/video-door-intercom/400/400",
    price: 95,
    originalPrice: 110,
    discountPercent: 10,
    rating: 5.0,
    tags: ["bestseller"],
  },
  {
    name: "PIR Motion Sensor",
    category: "Sensors & Detectors",
    image: "https://picsum.photos/seed/pir-motion-sensor/400/400",
    price: 28,
    originalPrice: 35,
    discountPercent: 20,
    rating: 4.6,
    tags: ["latest"],
  },
  {
    name: "8-Channel NVR Recorder",
    category: "CCTV Cameras",
    image: "https://picsum.photos/seed/nvr-recorder-8ch/400/400",
    price: 180,
    originalPrice: 220,
    discountPercent: 15,
    rating: 4.8,
    tags: ["featured", "bestseller"],
  },
  {
    name: "Smart Door Lock",
    category: "Access Control",
    image: "https://picsum.photos/seed/smart-door-lock/400/400",
    price: 130,
    originalPrice: 150,
    discountPercent: 10,
    rating: 4.9,
    tags: ["bestseller"],
  },
  {
    name: "Glass Break Detector",
    category: "Sensors & Detectors",
    image: "https://picsum.photos/seed/glass-break-detector/400/400",
    price: 40,
    originalPrice: 48,
    discountPercent: 15,
    rating: 4.5,
    tags: ["featured"],
  },
];

const FILTERS: { label: string; value: "all" | ProductTag }[] = [
  { label: "All Products", value: "all" },
  { label: "Latest Products", value: "latest" },
  { label: "Best Sellers", value: "bestseller" },
  { label: "Featured Products", value: "featured" },
];

const LATEST_LIMIT = 8;

function LatestProductsGrid() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["storefront-products", "latest", LATEST_LIMIT],
    queryFn: () =>
      getStorefrontProducts({ sort: "newest", per_page: LATEST_LIMIT }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: LATEST_LIMIT }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-square w-full bg-muted" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-2/3 rounded bg-muted" />
              <div className="h-3 w-1/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Failed to load the latest products.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Retry
        </button>
      </div>
    );
  }

  const products: StorefrontProduct[] = data?.data ?? [];

  if (products.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-muted-foreground">
        No products yet.
      </p>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="relative bg-muted/50">
            {product.discount_percentage !== null ? (
              <span className="absolute top-4 left-4 z-10 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                {product.discount_percentage}% off
              </span>
            ) : product.is_new ? (
              <span className="absolute top-4 left-4 z-10 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                New
              </span>
            ) : null}

            <Link href={`/products/${product.id}`} aria-label={product.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  product.image ??
                  `https://picsum.photos/seed/product-${product.id}/400/400`
                }
                alt={product.name}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </Link>

            {!product.in_stock ? (
              <span className="absolute inset-x-2 bottom-2 rounded-full bg-background/90 py-1.5 text-center text-xs font-medium text-muted-foreground">
                Out of stock
              </span>
            ) : null}
          </div>

          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              {product.category ?? "—"}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compare_price !== null &&
              product.compare_price > product.price ? (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compare_price)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Products() {
  const [activeFilter, setActiveFilter] = useState<"all" | ProductTag>("all");

  const filteredProducts =
    activeFilter === "all"
      ? []
      : PRODUCTS.filter((product) => product.tags.includes(activeFilter));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
          <span className="h-px w-6 bg-primary" />
          Our Products
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Our Products <span className="text-primary">Collections</span>
        </h2>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {activeFilter === "all" ? (
        <LatestProductsGrid />
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative bg-muted/50">
                <span className="absolute top-4 left-4 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                  {product.discountPercent}% off
                </span>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                    {product.rating.toFixed(1)}
                    <Star className="size-3.5 fill-primary text-primary" />
                  </div>
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
