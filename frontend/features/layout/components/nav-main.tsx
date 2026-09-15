"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Collapsible } from "@base-ui/react/collapsible"
import { Menu } from "@base-ui/react/menu"
import { cn } from "cn"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { NavItem, NavSection, NavSubItem } from "@/features/layout/types"

/** Shared shape of every top-level row, expanded or collapsed to the icon rail. */
const rowClassName =
  "h-9! gap-2.5 rounded-md px-2.5! py-2! text-[13px]! font-medium text-sidebar-foreground/70 transition-colors " +
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " +
  "data-active:bg-sidebar-primary data-active:font-medium data-active:text-sidebar-primary-foreground " +
  "data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground " +
  // On the rail the base size-8/p-2 leaves exactly the icon's 16px in the content
  // box, so the icon self-centers; mx-auto then centers the button in the rail.
  "group-data-[collapsible=icon]:mx-auto"

export function NavMain({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()
  const railed = state === "collapsed" && !isMobile

  /**
   * Only groups the user explicitly toggled are tracked. Everything else falls
   * back to "open when it owns the current route", so navigating reveals the
   * relevant group without fighting a choice the user already made.
   */
  const [toggled, setToggled] = React.useState<Record<string, boolean>>({})

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={section.label ?? `section-${index}`} className="px-2 py-1.5">
          {section.label && (
            <SidebarGroupLabel className="h-7 px-2.5 text-[10px] font-semibold tracking-[0.14em] text-sidebar-label-foreground uppercase">
              {section.label}
            </SidebarGroupLabel>
          )}

          {/* The rail has no room for section labels, so keep the groups readable with a divider. */}
          {section.label && index > 0 && (
            <div className="mx-auto mb-1 hidden h-px w-6 bg-sidebar-border group-data-[collapsible=icon]:block" />
          )}

          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {section.items.map((item) => {
                if (!item.items) {
                  return <NavLink key={item.href} item={item} active={pathname === item.href} />
                }

                const ownsRoute = item.items.some((subItem) => subItem.href === pathname)

                if (railed) {
                  return <NavFlyout key={item.href} item={item} active={ownsRoute} pathname={pathname} />
                }

                const open = toggled[item.href] ?? ownsRoute

                return (
                  <Collapsible.Root
                    key={item.href}
                    open={open}
                    onOpenChange={(next) => setToggled((prev) => ({ ...prev, [item.href]: next }))}
                    render={<SidebarMenuItem />}
                  >
                    <Collapsible.Trigger
                      render={
                        <SidebarMenuButton
                          size="sm"
                          // Highlighting a closed group keeps the current page visible;
                          // once it is open the child tab carries the highlight instead.
                          isActive={ownsRoute && !open}
                          className={cn("group/nav w-full cursor-pointer", rowClassName)}
                        />
                      }
                    >
                      <item.icon />
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      <NavBadge value={item.badge} />
                      <ChevronRight className="size-3.5! text-sidebar-muted-foreground transition-transform duration-200 group-data-panel-open/nav:rotate-90" />
                    </Collapsible.Trigger>

                    <Collapsible.Panel className="nav-panel">
                      <SidebarMenuSub className="mx-0 gap-0.5 border-0 px-0 py-1">
                        {item.items.map((subItem) => (
                          <NavSubLink
                            key={subItem.href}
                            item={subItem}
                            active={pathname === subItem.href}
                          />
                        ))}
                      </SidebarMenuSub>
                    </Collapsible.Panel>
                  </Collapsible.Root>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={active}
        size="sm"
        tooltip={item.label}
        className={rowClassName}
      >
        <item.icon />
        <span className="flex-1 truncate">{item.label}</span>
        <NavBadge value={item.badge} />
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function NavSubLink({ item, active }: { item: NavSubItem; active: boolean }) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        render={<Link href={item.href} />}
        isActive={active}
        className={cn(
          "h-8 rounded-md py-0 pr-3 pl-9 text-sidebar-foreground/60 transition-colors data-[size=md]:text-[13px]",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "data-active:bg-sidebar-primary data-active:font-medium data-active:text-sidebar-primary-foreground",
          "data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground",
        )}
      >
        <span className="flex-1 truncate">{item.label}</span>
        <NavBadge value={item.badge} />
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

/** Icon-rail groups open their children in a flyout instead of expanding in place. */
function NavFlyout({
  item,
  active,
  pathname,
}: {
  item: NavItem
  active: boolean
  pathname: string
}) {
  return (
    <Menu.Root>
      <SidebarMenuItem>
        <Menu.Trigger
          openOnHover
          delay={120}
          render={
            <SidebarMenuButton
              size="sm"
              isActive={active}
              className={cn("w-full cursor-pointer", rowClassName)}
            />
          }
        >
          <item.icon />
          <span className="flex-1 truncate text-left">{item.label}</span>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner side="right" align="start" sideOffset={8} className="z-50">
            <Menu.Popup className="min-w-56 origin-(--transform-origin) rounded-lg border border-sidebar-border bg-sidebar p-1 text-sidebar-foreground shadow-xl shadow-black/30 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-sidebar-label-foreground uppercase">
                {item.label}
              </div>
              {item.items?.map((subItem) => (
                <Menu.LinkItem
                  key={subItem.href}
                  render={<Link href={subItem.href} />}
                  className={cn(
                    "flex h-8 cursor-pointer items-center gap-2 rounded-md px-2.5 text-[13px] text-sidebar-foreground/70 outline-none select-none",
                    "data-highlighted:bg-sidebar-accent data-highlighted:text-sidebar-accent-foreground",
                    pathname === subItem.href &&
                      "bg-sidebar-primary font-medium text-sidebar-primary-foreground data-highlighted:bg-sidebar-primary data-highlighted:text-sidebar-primary-foreground",
                  )}
                >
                  <span className="flex-1 truncate">{subItem.label}</span>
                  <NavBadge value={subItem.badge} />
                </Menu.LinkItem>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </SidebarMenuItem>
    </Menu.Root>
  )
}

/**
 * Counter pill. On the icon rail there is no room for the number, so it degrades
 * to a dot on the corner of the icon button.
 */
function NavBadge({ value }: { value?: number }) {
  if (!value) return null

  return (
    <>
      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-chip px-1.5 text-[11px] font-semibold text-sidebar-chip-foreground tabular-nums group-data-[collapsible=icon]:hidden">
        {value}
      </span>
      <span
        aria-hidden
        className="absolute top-1.5 right-1.5 hidden size-1.5 rounded-full bg-sidebar-chip ring-2 ring-sidebar group-data-[collapsible=icon]:block"
      />
    </>
  )
}
