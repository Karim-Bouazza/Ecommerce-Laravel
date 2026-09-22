import { cn } from "cn"

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function RateBadge({ value }: { value: number }) {
  const className =
    value >= 70
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : value >= 40
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "bg-destructive/10 text-destructive"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {percentFormatter.format(value)} %
    </span>
  )
}
