import type { ComponentType, ReactNode } from "react"

import { cn } from "cn"

type SettingsPageShellProps = {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function SettingsPageShell({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
}: SettingsPageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl space-y-6", className)}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <Icon className="size-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {actions}
      </header>
      {children}
    </div>
  )
}
