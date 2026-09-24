"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  CATALOG_PRODUCTS,
  PRICE_BOUNDS,
  RATING_OPTIONS,
  SORT_OPTIONS,
  type CatalogProduct,
  type SortValue,
} from "./catalog-data"

export type FacetKey = "category" | "brand" | "color" | "connectivity" | "availability"

export const FACET_KEYS: FacetKey[] = ["category", "brand", "color", "connectivity", "availability"]

export type CatalogFilters = Record<FacetKey, string[]> & {
  price: [number, number] | null
  rating: number | null
  search: string
  sort: SortValue
}

const FACET_VALUE: Record<FacetKey, (product: CatalogProduct) => string> = {
  category: (p) => p.category,
  brand: (p) => p.brand,
  color: (p) => p.color,
  connectivity: (p) => p.connectivity,
  availability: (p) => (p.inStock ? "in-stock" : "out-of-stock"),
}

function parseList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : []
}

function parseFilters(params: URLSearchParams): CatalogFilters {
  const min = Number(params.get("min"))
  const max = Number(params.get("max"))
  const hasPrice = params.has("min") || params.has("max")
  const sort = params.get("sort")
  const rating = Number(params.get("rating"))

  return {
    category: parseList(params.get("category")),
    brand: parseList(params.get("brand")),
    color: parseList(params.get("color")),
    connectivity: parseList(params.get("connectivity")),
    availability: parseList(params.get("availability")),
    price: hasPrice
      ? [
          Number.isFinite(min) && params.has("min") ? min : PRICE_BOUNDS[0],
          Number.isFinite(max) && params.has("max") ? max : PRICE_BOUNDS[1],
        ]
      : null,
    rating: RATING_OPTIONS.some((r) => r === rating) ? rating : null,
    search: params.get("search")?.trim() ?? "",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortValue) : "featured",
  }
}

// `skip` lets facet counts ignore their own facet, so each option shows how
// many results it would yield if selected.
function matches(product: CatalogProduct, filters: CatalogFilters, skip?: FacetKey | "rating") {
  for (const key of FACET_KEYS) {
    if (key === skip || filters[key].length === 0) continue
    if (!filters[key].includes(FACET_VALUE[key](product))) return false
  }
  if (filters.price) {
    const [min, max] = filters.price
    if (product.price < min || product.price > max) return false
  }
  if (skip !== "rating" && filters.rating && product.rating < filters.rating) return false
  if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
    return false
  }
  return true
}

function sortProducts(products: CatalogProduct[], sort: SortValue) {
  const sorted = [...products]
  switch (sort) {
    case "new":
      return sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew))
    case "popular":
      return sorted.sort((a, b) => b.reviews - a.reviews)
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted
  }
}

export function useCatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  )

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const toggleValue = useCallback(
    (key: FacetKey, value: string) =>
      updateParams((params) => {
        const current = parseList(params.get(key))
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
        if (next.length) params.set(key, next.join(","))
        else params.delete(key)
      }),
    [updateParams]
  )

  const setPrice = useCallback(
    ([min, max]: [number, number]) =>
      updateParams((params) => {
        if (min > PRICE_BOUNDS[0]) params.set("min", String(min))
        else params.delete("min")
        if (max < PRICE_BOUNDS[1]) params.set("max", String(max))
        else params.delete("max")
      }),
    [updateParams]
  )

  const setRating = useCallback(
    (rating: number | null) =>
      updateParams((params) => {
        if (rating) params.set("rating", String(rating))
        else params.delete("rating")
      }),
    [updateParams]
  )

  const setSort = useCallback(
    (sort: SortValue) =>
      updateParams((params) => {
        if (sort === "featured") params.delete("sort")
        else params.set("sort", sort)
      }),
    [updateParams]
  )

  const clearSearch = useCallback(
    () => updateParams((params) => params.delete("search")),
    [updateParams]
  )

  const clearAll = useCallback(
    () =>
      updateParams((params) => {
        for (const key of [...FACET_KEYS, "min", "max", "rating", "search"]) params.delete(key)
      }),
    [updateParams]
  )

  const products = useMemo(
    () => sortProducts(CATALOG_PRODUCTS.filter((p) => matches(p, filters)), filters.sort),
    [filters]
  )

  const counts = useMemo(() => {
    const result = {} as Record<FacetKey, Record<string, number>>
    for (const key of FACET_KEYS) {
      result[key] = {}
      for (const product of CATALOG_PRODUCTS) {
        if (!matches(product, filters, key)) continue
        const value = FACET_VALUE[key](product)
        result[key][value] = (result[key][value] ?? 0) + 1
      }
    }
    return result
  }, [filters])

  const ratingCounts = useMemo(() => {
    const pool = CATALOG_PRODUCTS.filter((p) => matches(p, filters, "rating"))
    return Object.fromEntries(
      RATING_OPTIONS.map((r) => [r, pool.filter((p) => p.rating >= r).length])
    ) as Record<number, number>
  }, [filters])

  const activeCount =
    FACET_KEYS.reduce((total, key) => total + filters[key].length, 0) +
    (filters.price ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.search ? 1 : 0)

  return {
    filters,
    products,
    counts,
    ratingCounts,
    activeCount,
    toggleValue,
    setPrice,
    setRating,
    setSort,
    clearSearch,
    clearAll,
  }
}

export type CatalogFiltersApi = ReturnType<typeof useCatalogFilters>
