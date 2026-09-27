"use client"

import { createContext, useContext, type ReactNode } from "react"

import type { SiteLanguage } from "@/features/site-settings/types"

const StorefrontLanguageContext = createContext<SiteLanguage>("fr")

export function StorefrontLanguageProvider({
  language,
  children,
}: {
  language: SiteLanguage
  children: ReactNode
}) {
  return (
    <StorefrontLanguageContext.Provider value={language}>
      {children}
    </StorefrontLanguageContext.Provider>
  )
}

export function useStorefrontLanguage() {
  return useContext(StorefrontLanguageContext)
}
