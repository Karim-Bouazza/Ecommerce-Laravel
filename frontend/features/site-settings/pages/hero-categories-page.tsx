"use client"

import { LayoutGrid } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CapacityMeter } from "@/features/site-settings/components/capacity-meter"
import { HeroCategoryAddForm } from "@/features/site-settings/components/hero-category-add-form"
import { HeroCategoryList } from "@/features/site-settings/components/hero-category-list"
import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"
import { useHeroCategories } from "@/features/site-settings/hooks/use-hero-categories"
import { HERO_CATEGORIES_MAX } from "@/features/site-settings/types"

export function HeroCategoriesPage() {
  const { data, isLoading } = useHeroCategories()

  return (
    <SettingsPageShell
      icon={LayoutGrid}
      title="Catégories de l'accueil"
      description="Choisissez les catégories affichées dans le bloc d'accueil de la boutique, avec leur image. Le nombre de cartes suit les catégories sélectionnées et le nombre de produits est calculé automatiquement."
      className="max-w-3xl"
    >
      {isLoading || !data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Catégories mises en avant</CardTitle>
            <CardDescription>Utilisez les flèches pour changer l&apos;ordre d&apos;affichage.</CardDescription>
            <CapacityMeter
              count={data.length}
              max={HERO_CATEGORIES_MAX}
              label="Catégories sélectionnées"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <HeroCategoryList items={data} />
            <HeroCategoryAddForm existing={data} />
          </CardContent>
        </Card>
      )}
    </SettingsPageShell>
  )
}
