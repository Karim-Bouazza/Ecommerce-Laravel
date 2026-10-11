import type { LucideIcon } from "lucide-react"
import { Clock } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "cn"

import { Card } from "@/components/ui/card"

type DashboardWidgetProps = {
  title: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function DashboardWidget({ title, icon: Icon, children, className }: DashboardWidgetProps) {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-foreground/10">
          <Icon className="size-4" />
        </div>
        <h3 className="font-heading text-sm font-semibold">{title}</h3>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </Card>
  )
}

export function ComingSoonWidget({
  title,
  icon,
  className,
}: Omit<DashboardWidgetProps, "children">) {
  return (
    <DashboardWidget title={title} icon={icon} className={className}>
      <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
        <Clock className="size-5" aria-hidden />
        <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium">Bientôt</span>
      </div>
    </DashboardWidget>
  )
}
