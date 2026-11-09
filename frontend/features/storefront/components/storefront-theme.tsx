import type { ReactNode } from "react"

import { getColorsTheme } from "@/features/site-settings/api/colors-theme-api"
import { getLogo } from "@/features/site-settings/api/logo-api"
import { getSiteLanguage } from "@/features/site-settings/api/language-api"
import type { SiteColorsTheme, SiteLanguage } from "@/features/site-settings/types"
import { StorefrontLogoProvider } from "@/features/storefront/lib/logo-context"
import { StorefrontLanguageProvider } from "@/features/storefront/components/storefront-locale"
import { ttlCache } from "@/lib/server-ttl-cache"

// These settings change rarely (only from the admin panel), but are needed on
// every storefront render. Caching them in the Node process for a minute saves
// three backend calls per page view; an admin change shows up within 60s.
const SETTINGS_TTL_MS = 60_000
const getCachedColorsTheme = ttlCache(getColorsTheme, SETTINGS_TTL_MS)
const getCachedLogo = ttlCache(getLogo, SETTINGS_TTL_MS)
const getCachedSiteLanguage = ttlCache(getSiteLanguage, SETTINGS_TTL_MS)

const DEFAULT_COLORS_THEME: SiteColorsTheme = {
  primary_color: "#007fff",
  primary_dark_color: "#0018b8",
  primary_mid_color: "#0055ff",
  accent_color: "#00cff0",
  accent_light_color: "#7defff",
  contrast_color: "#ffffff",
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i

function safeColor(theme: SiteColorsTheme, key: keyof SiteColorsTheme): string {
  const value = theme[key]
  return value && HEX_COLOR.test(value) ? value : DEFAULT_COLORS_THEME[key]
}

export async function StorefrontTheme({ children }: { children: ReactNode }) {
  const [theme, logo, languageSetting] = await Promise.all([
    getCachedColorsTheme().catch(() => DEFAULT_COLORS_THEME),
    getCachedLogo().catch(() => null),
    getCachedSiteLanguage().catch(() => ({ language: "fr" as SiteLanguage })),
  ])

  const css = `:root {
  --brand-950: ${safeColor(theme, "primary_dark_color")};
  --brand-700: ${safeColor(theme, "primary_mid_color")};
  --brand-500: ${safeColor(theme, "primary_color")};
  --brand-300: ${safeColor(theme, "accent_color")};
  --brand-200: ${safeColor(theme, "accent_light_color")};
  --brand-white: ${safeColor(theme, "contrast_color")};
}

/* Keep the storefront's brand color identical in dark mode instead of the
   dashboard's default light->dark swap (primary -> accent). Dark mode should
   only change neutral surfaces (background, card, border, ...), not the
   configured brand color itself. */
.dark {
  --primary: var(--brand-500);
  --primary-foreground: var(--brand-white);
  --ring: var(--brand-500);
}`

  return (
    <>
      <style>{css}</style>
      <StorefrontLanguageProvider language={languageSetting.language}>
        <StorefrontLogoProvider logoUrl={logo?.logo_url ?? null}>{children}</StorefrontLogoProvider>
      </StorefrontLanguageProvider>
    </>
  )
}
