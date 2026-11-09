import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StorefrontTheme } from "@/features/storefront/components/storefront-theme"
import { Navbar } from "@/features/storefront/components/navbar"
import { Footer } from "@/features/storefront/components/footer"
import { ProductPage } from "@/features/storefront/product/product-page"
import { getStorefrontProduct } from "@/features/storefront/catalog/api/products-api"
import { ApiError } from "@/lib/api"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

// Only a real 404 means "product not found". Any other failure (429, 5xx,
// network) is rethrown so it renders the error page instead of a misleading 404.
const getProduct = cache((id: string) =>
  getStorefrontProduct(id).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }),
)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id)
  if (!product) return {}

  return {
    title: `${product.name} | CodAvenir`,
    description: product.short_description ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct((await params).id)

  if (!product) {
    notFound()
  }

  return (
    <StorefrontTheme>
      <Navbar />
      <ProductPage product={product} />
      <Footer />
    </StorefrontTheme>
  )
}
