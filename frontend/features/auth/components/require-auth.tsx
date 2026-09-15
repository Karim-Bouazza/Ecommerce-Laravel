"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useMe } from "@/features/auth/hooks/use-me"

/** Redirects to /login once the session is known to be invalid (fetched and empty). */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: me, isPending } = useMe()

  React.useEffect(() => {
    if (!isPending && me === null) {
      router.replace("/login")
    }
  }, [isPending, me, router])

  if (isPending || me === null) return null

  return <>{children}</>
}
