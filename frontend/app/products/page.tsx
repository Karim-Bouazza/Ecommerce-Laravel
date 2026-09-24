import { Suspense } from "react"
import type { Metadata } from "next"
import { StorefrontTheme } from "@/features/storefront/components/storefront-theme"
import { Navbar } from "@/features/storefront/components/navbar"
import { Footer } from "@/features/storefront/components/footer"
import { CatalogPage } from "@/features/storefront/catalog/catalog-page"

export const metadata: Metadata = {
  title: "Produits | CodAvenir",
  description: "Caméras, alarmes, contrôle d'accès et solutions de sécurité connectées.",
}

export const dynamic = "force-dynamic"

export default function ProductsPage() {
  return (
    <StorefrontTheme>
      <Navbar />
      {/* useSearchParams (filtres dans l'URL) nécessite une frontière Suspense */}
      <Suspense>
        <CatalogPage />
      </Suspense>
      <Footer />
    </StorefrontTheme>
  )
}
