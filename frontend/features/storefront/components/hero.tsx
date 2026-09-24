"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import type { HeroCategory } from "@/features/site-settings/types";

const CUSTOMER_INITIALS = ["SA", "ML", "KJ", "RB"];

const ROTATE_INTERVAL_MS = 3000;
const STACK_OFFSET_PX = 28;

export function Hero({ categories = [] }: { categories?: HeroCategory[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (categories.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % categories.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [categories.length]);

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div
        className={`grid w-full items-center gap-12 ${categories.length > 0 ? "lg:grid-cols-2" : ""}`}
      >
        <div>
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            Équipements de sécurité professionnels
          </Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Sécurisez vos espaces,
            <br />
            <span className="text-primary">protégez votre avenir.</span>
          </h1>

          <p className="mt-4 max-w-md text-muted-foreground">
            Des solutions fiables pour protéger votre maison, votre entreprise
            et vos locaux : caméras, alarmes, contrôle d’accès et systèmes de
            sécurité.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/products" />}
              className="gap-2 px-5"
            >
              Acheter maintenant
              <ArrowUpRight className="size-4" />
            </Button>

            <Button
              variant="link"
              size="lg"
              nativeButton={false}
              render={<Link href="/products" />}
              className="px-0 font-medium text-foreground underline underline-offset-4"
            >
              Voir nos produits
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <AvatarGroup>
              {CUSTOMER_INITIALS.map((initials) => (
                <Avatar key={initials}>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+</AvatarGroupCount>
            </AvatarGroup>

            <div>
              <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                4.9 Ratings
                <Star className="size-3.5 fill-primary text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                Trusted by 10,000+ Customers
              </p>
            </div>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="relative mx-auto aspect-4/5 w-full max-w-[320px]">
            {categories.map((category, index) => {
              const total = categories.length;
              const depth = (index - activeIndex + total) % total;
              const isFront = depth === 0;

              return (
                <motion.div
                  key={category.id}
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  style={{ zIndex: total - depth }}
                  animate={{
                    x: depth * STACK_OFFSET_PX,
                    y: depth * STACK_OFFSET_PX,
                    scale: 1 - depth * 0.06,
                    opacity: 1 - depth * 0.22,
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div
                    className={
                      isFront ? "pointer-events-auto" : "pointer-events-none"
                    }
                  >
                    <div className="p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={category.image_url ?? undefined}
                        alt={category.category_name}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 px-3 pb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {category.category_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.item_count} produit
                          {category.item_count > 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
