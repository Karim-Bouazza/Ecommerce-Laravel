"use client"

import type * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ChevronsLeft, LogOut } from "lucide-react"
import { cn } from "cn"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { NAV_SECTIONS } from "@/features/layout/constants/nav-items"
import { NavMain } from "@/features/layout/components/nav-main"
import { filterNavSections } from "@/features/layout/lib/filter-nav"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useAbility } from "@/features/auth/lib/ability-provider"
import { parsePermissionKey } from "@/features/auth/lib/ability"

export function AppSidebar() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logoutMutation = useLogout()
  const ability = useAbility()
  const { toggleSidebar } = useSidebar()

  const sections = filterNavSections(NAV_SECTIONS, (permission) => {
    if (!permission) return true
    const [subject, action] = parsePermissionKey(permission)
    return ability.can(action, subject)
  })

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // Local logout still proceeds even if the server call fails.
    } finally {
      queryClient.clear()
      toast.success("Déconnexion réussie")
      router.push("/login")
    }
  }

  return (
    <Sidebar collapsible="icon" className="h-svh border-r border-sidebar-border">
      <SidebarHeader className="gap-0 p-0">
        <div className="flex h-16 items-center gap-2.5 pr-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Link href="/admin" className="flex min-w-0 items-center gap-2.5" aria-label="CodAvenir">
            <span className="hidden group-data-[collapsible=icon]:block">
              <BrandMark />
            </span>

            <span className="flex min-w-0 items-center group-data-[collapsible=icon]:hidden">
              <Image
                src="/logo.png"
                alt=""
                width={2172}
                height={724}
                priority
                className="h-14 w-auto dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt=""
                width={2172}
                height={724}
                priority
                className="hidden h-14 w-auto dark:block"
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Réduire le menu"
            className="ml-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-sidebar-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
          >
            <ChevronsLeft className="size-4" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent className="py-1">
        <NavMain sections={sections} />
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      <SidebarFooter className="p-2">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          title="Déconnexion"
          className={cn(
            "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium",
            "text-red-600 transition-colors hover:bg-red-500/10 hover:text-red-700",
            "dark:text-red-400/90 dark:hover:text-red-300",
            "disabled:pointer-events-none disabled:opacity-50",
            "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
          )}
        >
          <LogOut className="size-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}

function BrandMark() {
  return (
    <span
      className="relative block size-8 shrink-0 overflow-hidden"
      style={{ "--mark": "2rem" } as React.CSSProperties}
    >
      <Image
        src="/logo.png"
        alt=""
        width={2172}
        height={724}
        priority
        className="absolute h-auto max-w-none"
        style={{
          width: "calc(var(--mark) * 2172 / 413)",
          left: "calc(var(--mark) * -174 / 413)",
          top: "calc(var(--mark) * -168 / 413)",
        }}
      />
    </span>
  )
}
