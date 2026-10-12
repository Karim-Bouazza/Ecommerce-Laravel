import { getHeroCategories } from "@/features/site-settings/api/hero-categories-api"
import {
  getStorefrontFeatures,
  getStorefrontPromoBanners,
  getStorefrontSectionProducts,
} from "@/features/site-settings/api/storefront-content-api"
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
  // Each block is optional: a failed request just hides its section.
  const [heroCategories, bestOffers, features, newArrivals, stylePicks, promoBanners] =
    await Promise.all([
      getHeroCategories().catch(() => []),
      getStorefrontSectionProducts("best_offers").catch(() => []),
      getStorefrontFeatures().catch(() => []),
      getStorefrontSectionProducts("new_arrivals").catch(() => []),
      getStorefrontSectionProducts("style_picks").catch(() => []),
      getStorefrontPromoBanners().catch(() => []),
    ])

  return (
    <StorefrontTheme>
      <Navbar />
      <Hero categories={heroCategories} />
      <Categories items={heroCategories} />
      <Products />
      <FeaturedCarousel />
      <DealsOfTheDay offers={bestOffers} />
      <ProductFeatures features={features} />
      <NewArrivals items={newArrivals} />
      <ChooseYourStyle products={stylePicks} />
      <PromoBanners banners={promoBanners} />
      <CtaBanner />
      <Footer />
    </StorefrontTheme>
  )
}