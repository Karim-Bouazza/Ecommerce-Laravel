import type { ReactNode } from "react"

import { getSiteLanguage } from "@/features/site-settings/api/language-api"
import type { SiteLanguage } from "@/features/site-settings/types"
import { StorefrontLanguageProvider } from "@/features/storefront/components/storefront-locale"
import { ttlCache } from "@/lib/server-ttl-cache"

const SETTINGS_TTL_MS = 60_000
const getCachedSiteLanguage = ttlCache(getSiteLanguage, SETTINGS_TTL_MS)

export async function StorefrontTheme({ children }: { children: ReactNode }) {
  const languageSetting = await getCachedSiteLanguage().catch(() => ({
    language: "fr" as SiteLanguage,
  }))

  return (
    <StorefrontLanguageProvider language={languageSetting.language}>
      {children}
    </StorefrontLanguageProvider>
  )
}
