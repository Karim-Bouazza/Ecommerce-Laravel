"use client"

import * as React from "react"
import { formatDistanceToNowStrict } from "date-fns"
import { fr } from "date-fns/locale"

export function ElapsedTime({ since }: { since: string }) {
  const [label, setLabel] = React.useState(() =>
    formatDistanceToNowStrict(new Date(since), { locale: fr })
  )

  React.useEffect(() => {
    setLabel(formatDistanceToNowStrict(new Date(since), { locale: fr }))
    const interval = setInterval(() => {
      setLabel(formatDistanceToNowStrict(new Date(since), { locale: fr }))
    }, 30_000)
    return () => clearInterval(interval)
  }, [since])

  return <span>{label}</span>
}
