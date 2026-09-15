import type { NavItem, NavSection } from "@/features/layout/types"

/**
 * Drops nav entries the current user has no permission for, then drops the
 * groups and sections left empty by that pruning.
 */
export function filterNavSections(
  sections: NavSection[],
  canView: (permission?: string) => boolean,
): NavSection[] {
  return sections
    .map((section): NavSection | null => {
      const items = section.items.flatMap((item): NavItem[] => {
        if (!item.items) {
          return canView(item.permission) ? [item] : []
        }

        const subItems = item.items.filter((subItem) => canView(subItem.permission))
        return subItems.length > 0 ? [{ ...item, items: subItems }] : []
      })

      return items.length > 0 ? { ...section, items } : null
    })
    .filter((section) => section !== null)
}
