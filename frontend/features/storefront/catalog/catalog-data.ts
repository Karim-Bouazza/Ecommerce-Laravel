export type FilterOption = { value: string; label: string }

export const AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: "in-stock", label: "En stock" },
  { value: "out-of-stock", label: "Rupture de stock" },
]

export const SORT_OPTIONS = [
  { value: "featured", label: "Recommandés" },
  { value: "new", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]["value"]

export const PRICE_STEP = 100
