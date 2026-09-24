import { getHeroCategories } from "@/features/site-settings/api/hero-categories-api"
import { StorefrontTheme } from "@/features/storefront/components/storefront-theme"
import { Navbar } from "@/features/storefront/components/navbar"
import { Hero } from "@/features/storefront/components/hero"
import { Categories } from "@/features/storefront/components/categories"
import { Products } from "@/features/storefront/components/products"
import { FeaturedCarousel } from "@/features/storefront/components/featured-carousel"
import { DealsOfTheDay } from "@/features/storefront/components/deals-of-the-day"
import { ProductFeatures } from "@/features/storefront/components/product-features"
import { NewArrivals } from "@/features/storefront/components/new-arrivals"
import { ChooseYourStyle } from "@/features/storefront/components/choose-your-style"
import { PromoBanners } from "@/features/storefront/components/promo-banners"
import { CtaBanner } from "@/features/storefront/components/cta-banner"
import { Footer } from "@/features/storefront/components/footer"

export const dynamic = "force-dynamic"

export default async function Home() {
  const heroCategories = await getHeroCategories().catch(() => [])

  return (
    <StorefrontTheme>
      <Navbar />
      <Hero categories={heroCategories} />
      <Categories />
      <Products />
      <FeaturedCarousel />
      <DealsOfTheDay />
      <ProductFeatures />
      <NewArrivals />
      <ChooseYourStyle />
      <PromoBanners />
      <CtaBanner />
      <Footer />
    </StorefrontTheme>
  )
}