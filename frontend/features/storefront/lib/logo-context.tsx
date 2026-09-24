"use client"

import { createContext, useContext, type ReactNode } from "react"

const StorefrontLogoContext = createContext<string | null>(null)

export function StorefrontLogoProvider({
  logoUrl,
  children,
}: {
  logoUrl: string | null
  children: ReactNode
}) {
  return (
    <StorefrontLogoContext.Provider value={logoUrl}>{children}</StorefrontLogoContext.Provider>
  )
}

export function useStorefrontLogo(): string | null {
  return useContext(StorefrontLogoContext)
}
