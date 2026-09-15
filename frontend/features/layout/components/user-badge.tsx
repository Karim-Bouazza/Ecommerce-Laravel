"use client"

import { cn } from "cn"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useMe } from "@/features/auth/hooks/use-me"

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function UserBadge({ className }: { className?: string }) {
  const { data: me } = useMe()

  if (!me) return null

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar>
        <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
          {getInitials(me.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold">{me.name}</span>
        {me.role && (
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {me.role.name}
          </span>
        )}
      </div>
    </div>
  )
}
