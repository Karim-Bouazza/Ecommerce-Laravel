import type { LucideIcon } from "lucide-react"
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
