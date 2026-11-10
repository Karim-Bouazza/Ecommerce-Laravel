"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "cn"

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className="flex items-center justify-between gap-6 px-3 py-2">
      <span className="text-sm font-medium">Thème</span>
      <div className="flex items-center gap-0.5 rounded-full bg-muted p-1">
        <button
          type="button"
          aria-label="Thème clair"
          aria-pressed={mounted && !isDark}
          onClick={() => setTheme("light")}
          className={cn(
            "flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors",
            mounted && !isDark && "bg-background text-foreground shadow-sm"
          )}
        >
          <Sun className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Thème sombre"
          aria-pressed={isDark}
          onClick={() => setTheme("dark")}
          className={cn(
            "flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors",
            isDark && "bg-background text-foreground shadow-sm"
          )}
        >
          <Moon className="size-4" />
        </button>
      </div>
    </div>
  )
}
