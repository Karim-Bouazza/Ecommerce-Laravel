import type { LucideIcon } from "lucide-react"

export type NavSubItem = {
  label: string
  href: string
  /** Raw backend permission key ("<subject>.<action>"), e.g. "orders_nouvelles.view". Omit for ungated items. */
  permission?: string
  /** Counter rendered at the end of the row. Omit (or pass 0) to render nothing. */
  badge?: number
}

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** Raw backend permission key ("<subject>.<action>"), e.g. "products.view". Omit for ungated items. */
  permission?: string
  /** Counter rendered at the end of the row. Omit (or pass 0) to render nothing. */
  badge?: number
  /** Sub-items rendered as a collapsible group under this entry, instead of a direct link. */
  items?: NavSubItem[]
}

export type NavSection = {
  /** Uppercase heading above the group. Omit for the first, unlabelled section. */
  label?: string
  items: NavItem[]
}
