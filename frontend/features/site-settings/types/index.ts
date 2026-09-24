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

export type HeroCategory = {
  id: number
  position: number
  image_url: string | null
  category_id: number
  category_name: string
  item_count: number
}
