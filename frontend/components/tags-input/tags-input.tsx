"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "cn"

type TagsInputProps = {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Taper puis Entrée…",
  disabled,
  invalid,
  className,
}: TagsInputProps) {
  const items = value ?? []
  const [draft, setDraft] = React.useState("")

  function commitDraft() {
    const trimmed = draft.trim()
    setDraft("")
    if (trimmed === "" || items.includes(trimmed)) return
    onChange([...items, trimmed])
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      commitDraft()
      return
    }
    if (event.key === "Backspace" && draft === "" && items.length > 0) {
      onChange(items.slice(0, -1))
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        invalid && "border-destructive ring-3 ring-destructive/20",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="flex h-5.25 w-fit items-center justify-center gap-1 rounded-sm bg-muted py-0 pr-1 pl-1.5 text-xs font-medium whitespace-nowrap text-foreground"
        >
          {item}
          <button
            type="button"
            aria-label={`Supprimer ${item}`}
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="flex size-4 items-center justify-center rounded-xs hover:bg-muted-foreground/20"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={items.length === 0 ? placeholder : undefined}
        disabled={disabled}
        className="min-w-24 flex-1 bg-transparent py-0.5 outline-none"
      />
    </div>
  )
}
