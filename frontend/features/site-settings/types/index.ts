export type SiteColorsTheme = {
  primary_color: string
  primary_dark_color: string
  primary_mid_color: string
  accent_color: string
  accent_light_color: string
  contrast_color: string
}

export type SiteLogo = {
  logo_url: string | null
}

export type SiteLanguage = "fr" | "ar"

export type SiteLanguageSetting = {
  language: SiteLanguage
}

export type HeroCategory = {
  id: number
  position: number
  image_url: string | null
  category_id: number
  category_name: string
  item_count: number
}

export const HERO_CATEGORIES_MAX = 5

export type StorefrontSection = "best_offers" | "new_arrivals" | "style_picks"

export type SectionProduct = {
  id: number
  position: number
  label: string | null
  product_id: number
  name: string
  short_description: string | null
  price: number
  compare_price: number | null
  discount_percentage: number | null
  image: string | null
  images: string[]
  is_active: boolean
  specs: string[]
}

export type StorefrontFeature = {
  id: number
  position: number
  title: string
  description: string | null
  image_url: string | null
}

export const STOREFRONT_FEATURES_MAX = 5

export type StorefrontPromoBanner = {
  id: number
  position: number
  eyebrow: string | null
  title: string
  description: string | null
  button_label: string
  link_url: string | null
  highlight: boolean
  image_url: string | null
}

export const PROMO_BANNERS_MAX = 2
