import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StorefrontTheme } from "@/features/storefront/components/storefront-theme"
import { Navbar } from "@/features/storefront/components/navbar"
import { Footer } from "@/features/storefront/components/footer"
import { ProductPage } from "@/features/storefront/product/product-page"
import { getStorefrontProduct } from "@/features/storefront/catalog/api/products-api"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getStorefrontProduct((await params).id).catch(() => null)
  if (!product) return {}

  return {
    title: `${product.name} | CodAvenir`,
    description: product.short_description ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getStorefrontProduct((await params).id).catch(() => null)

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
