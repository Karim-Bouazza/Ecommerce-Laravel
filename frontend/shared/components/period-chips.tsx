"use client"

import { cn } from "cn"

export type PeriodOption<T extends string> = { value: T; label: string }

type PeriodChipsProps<T extends string> = {
  options: readonly PeriodOption<T>[]
  /** `null` means no preset is active (e.g. custom dates are applied). */
  value: T | null
  onChange: (value: T) => void
}

export function PeriodChips<T extends string>({ options, value, onChange }: PeriodChipsProps<T>) {
  return (
    <div role="group" aria-label="Période" className="flex flex-wrap gap-2">
      {options.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            value === item.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
