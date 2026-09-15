"use client"

import * as React from "react"
import {
  AbilityProvider as CaslAbilityProvider,
  useAbility as useCaslAbility,
  Can,
} from "@casl/react"

import { useMe } from "@/features/auth/hooks/use-me"
import { defineAbilitiesFor, type AppAbility } from "@/features/auth/lib/ability"

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const { data: me } = useMe()
  const ability = React.useMemo(() => defineAbilitiesFor(me), [me])

  return <CaslAbilityProvider value={ability}>{children}</CaslAbilityProvider>
}

export function useAbility() {
  return useCaslAbility<AppAbility>()
}

export { Can }
