"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { HeroCategoryAddForm } from "@/features/site-settings/components/hero-category-add-form"
import { HeroCategoryList } from "@/features/site-settings/components/hero-category-list"
import { useHeroCategories } from "@/features/site-settings/hooks/use-hero-categories"
import { HERO_CATEGORIES_MAX } from "@/features/site-settings/types"

export function HeroCategoriesPage() {
  const { data, isLoading } = useHeroCategories()

  if (isLoading || !data) {
    return <Skeleton className="h-96 w-full max-w-2xl" />
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          Catégories mises en avant (accueil) — {data.length}/{HERO_CATEGORIES_MAX}
        </CardTitle>
        <CardDescription>
          Choisissez jusqu&apos;à {HERO_CATEGORIES_MAX} catégories affichées dans le bloc
          d&apos;accueil de la boutique et leur image. Le nombre de cartes affichées suit
          exactement le nombre de catégories sélectionnées ici, et le nombre de produits est
          calculé automatiquement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <HeroCategoryList items={data} />
        <HeroCategoryAddForm existing={data} />
      </CardContent>
    </Card>
  )
}
