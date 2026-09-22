"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMe } from "@/features/auth/hooks/use-me"
import { getInitials } from "@/features/auth/lib/get-initials"

export function UserBadge({ className }: { className?: string }) {
  const { data: me } = useMe()

  if (!me) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-md outline-hidden",
          className
        )}
      >
        <Avatar>
          {me.avatar && <AvatarImage src={me.avatar} alt={me.name} />}
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {getInitials(me.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight text-left">
          <span className="text-sm font-semibold">{me.name}</span>
          {me.role && (
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {me.role.name}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href="/admin/profile" />}>
          <User />
          Profil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
