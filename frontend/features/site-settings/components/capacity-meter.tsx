import { cn } from "cn"

type CapacityMeterProps = {
  count: number
  max: number
  label: string
}

export function CapacityMeter({ count, max, label }: CapacityMeterProps) {
  const full = count >= max

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={count}
        className="flex flex-1 gap-1"
      >
        {Array.from({ length: max }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              index < count ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          full ? "text-primary" : "text-muted-foreground"
        )}
      >
        {count}/{max}
      </span>
    </div>
  )
}
