"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { trackViewContent } from "@/features/pixels/lib/track-events";
import type { StorefrontProductDetail } from "@/features/storefront/catalog/api/products-api";

const CodOrderForm = dynamic(() =>
  import("./cod-order-form").then((module) => module.CodOrderForm),
);

export function ProductOrderSection({
  product,
}: {
  product: StorefrontProductDetail;
}) {
  const inStock = product.in_stock;
  const orderFormRef = useRef<HTMLDivElement>(null);
  const [showFloatingOrderButton, setShowFloatingOrderButton] = useState(true);

  useEffect(() => {
    const orderForm = orderFormRef.current;

    if (!inStock || !orderForm || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingOrderButton(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );

    observer.observe(orderForm);

    return () => observer.disconnect();
  }, [inStock]);

  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }, [product.id, product.name, product.price, product.category]);

  return (
    <>
      {inStock ? (
        <div ref={orderFormRef} className="scroll-mt-24">
          <CodOrderForm product={product} />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Ce produit est momentanément indisponible.
        </div>
      )}

      {inStock && showFloatingOrderButton && (
        <button
          type="button"
          onClick={() =>
            orderFormRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 h-12 rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 md:hidden"
        >
          أطلب الآن
        </button>
      )}
    </>
  );
}
