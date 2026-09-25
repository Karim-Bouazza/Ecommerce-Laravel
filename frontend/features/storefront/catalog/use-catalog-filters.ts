"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  getStorefrontCategories,
  getStorefrontProducts,
} from "./api/products-api"
import { SORT_OPTIONS, type SortValue } from "./catalog-data"

export type FacetKey = "category" | "availability"

export const FACET_KEYS: FacetKey[] = ["category", "availability"]

export type CatalogFilters = Record<FacetKey, string[]> & {
  price: [number, number] | null
  search: string
  sort: SortValue
  page: number
}

const DEFAULT_PRICE_BOUNDS: [number, number] = [0, 100000]

function parseList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : []
}

function parseFilters(params: URLSearchParams): CatalogFilters {
  const min = Number(params.get("min"))
  const max = Number(params.get("max"))
  const hasPrice = params.has("min") || params.has("max")
  const sort = params.get("sort")
  const page = Number(params.get("page"))

  return {
    category: parseList(params.get("category")),
    availability: parseList(params.get("availability")),
    price: hasPrice
      ? [Number.isFinite(min) ? min : 0, Number.isFinite(max) ? max : DEFAULT_PRICE_BOUNDS[1]]
      : null,
    search: params.get("search")?.trim() ?? "",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortValue) : "featured",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

const SORT_MAP: Record<SortValue, "price_asc" | "price_desc" | "newest" | undefined> = {
  featured: undefined,
  new: "newest",
  "price-asc": "price_asc",
  "price-desc": "price_desc",
}

function availabilityToInStock(availability: string[]): 0 | 1 | undefined {
  const hasIn = availability.includes("in-stock")
  const hasOut = availability.includes("out-of-stock")
  if (hasIn && !hasOut) return 1
  if (hasOut && !hasIn) return 0
  return undefined
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
    (mutate: (params: URLSearchParams) => void, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      if (resetPage) params.delete("page")
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
    ([min, max]: [number, number], bounds: [number, number]) =>
      updateParams((params) => {
        if (min > bounds[0]) params.set("min", String(min))
        else params.delete("min")
        if (max < bounds[1]) params.set("max", String(max))
        else params.delete("max")
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

  const setPage = useCallback(
    (page: number) =>
      updateParams((params) => {
        if (page > 1) params.set("page", String(page))
        else params.delete("page")
      }, false),
    [updateParams]
  )

  const clearSearch = useCallback(
    () => updateParams((params) => params.delete("search")),
    [updateParams]
  )

  const clearAll = useCallback(
    () =>
      updateParams((params) => {
        for (const key of [...FACET_KEYS, "min", "max", "search", "sort", "page"]) params.delete(key)
      }),
    [updateParams]
  )

  const categoriesQuery = useQuery({
    queryKey: ["storefront-categories"],
    queryFn: getStorefrontCategories,
    staleTime: 5 * 60 * 1000,
  })

  const productsQuery = useQuery({
    queryKey: [
      "storefront-products",
      filters.category,
      filters.availability,
      filters.price,
      filters.search,
      filters.sort,
      filters.page,
    ],
    queryFn: () =>
      getStorefrontProducts({
        category_id: filters.category.length ? filters.category.join(",") : undefined,
        search: filters.search || undefined,
        price_min: filters.price?.[0],
        price_max: filters.price?.[1],
        in_stock: availabilityToInStock(filters.availability),
        sort: SORT_MAP[filters.sort],
        page: filters.page,
        per_page: 24,
      }),
    placeholderData: (previous) => previous,
  })

  const categories = categoriesQuery.data ?? []
  const priceBounds: [number, number] = productsQuery.data
    ? [productsQuery.data.price_bounds.min, productsQuery.data.price_bounds.max]
    : DEFAULT_PRICE_BOUNDS

  const counts = useMemo(() => {
    const categoryCounts: Record<string, number> = {}
    for (const category of categories) {
      categoryCounts[String(category.id)] = category.products_count
    }
    return {
      category: categoryCounts,
      availability: {},
    } as Record<FacetKey, Record<string, number>>
  }, [categories])

  const activeCount =
    FACET_KEYS.reduce((total, key) => total + filters[key].length, 0) +
    (filters.price ? 1 : 0) +
    (filters.search ? 1 : 0)

  return {
    filters,
    products: productsQuery.data?.data ?? [],
    total: productsQuery.data?.meta.total ?? 0,
    lastPage: productsQuery.data?.meta.last_page ?? 1,
    isLoading: productsQuery.isLoading,
    isFetching: productsQuery.isFetching,
    categories,
    priceBounds,
    counts,
    activeCount,
    toggleValue,
    setPrice,
    setSort,
    setPage,
    clearSearch,
    clearAll,
  }
}

export type CatalogFiltersApi = ReturnType<typeof useCatalogFilters>
