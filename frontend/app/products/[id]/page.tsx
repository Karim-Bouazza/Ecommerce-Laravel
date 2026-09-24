import type { Metadata } from "next"
import { StorefrontTheme } from "@/features/storefront/components/storefront-theme"
import { Navbar } from "@/features/storefront/components/navbar"
import { Footer } from "@/features/storefront/components/footer"
import { ProductPage } from "@/features/storefront/product/product-page"
import { getProduct } from "@/features/storefront/product/product-data"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).id)
  return {
    title: `${product.name} | CodAvenir`,
    description: product.shortDescription,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = getProduct((await params).id)

  return (
    <StorefrontTheme>
      <Navbar />
      <ProductPage product={product} />
      <Footer />
    </StorefrontTheme>
  )
}
