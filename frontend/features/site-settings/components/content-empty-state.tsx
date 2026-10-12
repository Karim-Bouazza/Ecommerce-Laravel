import type { ComponentType } from "react"

type ContentEmptyStateProps = {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

export function ContentEmptyState({ icon: Icon, title, description }: ContentEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <Icon className="size-5" />
      </span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
